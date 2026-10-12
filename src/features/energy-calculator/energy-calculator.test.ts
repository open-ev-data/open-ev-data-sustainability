import { describe, expect, it } from 'vitest';
import { createVehicle } from '@/test/fixtures/vehicles';
import {
  accumulateMonthly,
  estimateEnergy,
  getDerivedConsumptions,
  resolveConsumption,
  toAnnualDistanceKm,
} from './index';

describe('resolveConsumption', () => {
  it('prefers the reported efficiency in auto mode', () => {
    const vehicle = createVehicle({ efficiency: { energy_consumption_wh_per_km: 165 } });
    expect(resolveConsumption(vehicle)).toEqual({
      whPerKm: 165,
      source: 'reported',
      cycle: null,
      rangeKm: null,
    });
  });

  it('derives from net capacity and the best homologated range', () => {
    const consumption = resolveConsumption(createVehicle());
    expect(consumption?.source).toBe('derived');
    expect(consumption?.cycle).toBe('wltp');
    expect(consumption?.whPerKm).toBeCloseTo(160, 5);
  });

  it('derives from the explicitly selected cycle even when a value is reported', () => {
    const vehicle = createVehicle({
      efficiency: { energy_consumption_wh_per_km: 165 },
      range: {
        rated: [
          { cycle: 'wltp', range_km: 500 },
          { cycle: 'epa', range_km: 400 },
        ],
      },
    });
    expect(resolveConsumption(vehicle, 'epa')?.whPerKm).toBeCloseTo(200, 5);
  });

  it('returns null when the selected cycle is not available', () => {
    expect(resolveConsumption(createVehicle(), 'nedc')).toBeNull();
  });

  it('returns null without battery capacity or range', () => {
    expect(resolveConsumption(createVehicle({ battery: {} }))).toBeNull();
    expect(resolveConsumption(createVehicle({ range: { rated: [] } }))).toBeNull();
  });

  it('lists one derived value per cycle', () => {
    const vehicle = createVehicle({
      range: {
        rated: [
          { cycle: 'cltc', range_km: 640 },
          { cycle: 'wltp', range_km: 500 },
          { cycle: 'wltp', range_km: 480 },
        ],
      },
    });
    expect(getDerivedConsumptions(vehicle).map((item) => item.cycle)).toEqual(['wltp', 'cltc']);
  });
});

describe('estimateEnergy', () => {
  const consumption = { whPerKm: 165, source: 'reported' as const, cycle: null, rangeKm: null };

  it('matches the reference example of 15,000 km at 16.5 kWh/100 km', () => {
    const estimate = estimateEnergy(consumption, 15000, 'year');
    expect(estimate?.per100kmKwh).toBeCloseTo(16.5, 5);
    expect(estimate?.perYearKwh).toBeCloseTo(2475, 5);
    expect(estimate?.perMonthKwh).toBeCloseTo(206.25, 5);
  });

  it('converts daily and monthly distances to a year', () => {
    expect(toAnnualDistanceKm(40, 'day')).toBe(14600);
    expect(toAnnualDistanceKm(1000, 'month')).toBe(12000);
    expect(toAnnualDistanceKm(15000, 'year')).toBe(15000);
  });

  it('returns null without consumption or with an invalid distance', () => {
    expect(estimateEnergy(null, 15000, 'year')).toBeNull();
    expect(estimateEnergy(consumption, 0, 'year')).toBeNull();
    expect(estimateEnergy(consumption, Number.NaN, 'year')).toBeNull();
  });
});

describe('accumulateMonthly', () => {
  it('accumulates a constant monthly value over twelve months', () => {
    const series = accumulateMonthly(100);
    expect(series).toHaveLength(12);
    expect(series[0]).toEqual({ month: 'Jan', value: 100 });
    expect(series[11]).toEqual({ month: 'Dec', value: 1200 });
  });
});
