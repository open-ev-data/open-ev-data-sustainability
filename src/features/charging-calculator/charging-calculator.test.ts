import { describe, expect, it } from 'vitest';
import { createVehicle } from '@/test/fixtures/vehicles';
import {
  estimateCharging,
  estimateChargingByPower,
  getReportedChargingTimes,
  isValidSocRange,
} from './index';

const base = {
  capacityKwh: 80,
  initialSoc: 20,
  targetSoc: 80,
  chargerPowerKw: 11,
  vehicleMaxPowerKw: 11,
};

describe('estimateCharging', () => {
  it('computes energy, effective power and time', () => {
    const estimate = estimateCharging(base);
    expect(estimate?.energyNeededKwh).toBeCloseTo(48, 5);
    expect(estimate?.effectivePowerKw).toBe(11);
    expect(estimate?.hours).toBeCloseTo(48 / 11, 5);
    expect(estimate?.limitedBy).toBe('none');
  });

  it('is limited by the charger when it is weaker than the vehicle', () => {
    const estimate = estimateCharging({ ...base, chargerPowerKw: 3.7, vehicleMaxPowerKw: 11 });
    expect(estimate?.effectivePowerKw).toBe(3.7);
    expect(estimate?.limitedBy).toBe('charger');
  });

  it('is limited by the vehicle when the charger is stronger', () => {
    const estimate = estimateCharging({ ...base, chargerPowerKw: 22, vehicleMaxPowerKw: 11 });
    expect(estimate?.effectivePowerKw).toBe(11);
    expect(estimate?.limitedBy).toBe('vehicle');
  });

  it('returns null for missing or invalid inputs', () => {
    expect(estimateCharging({ ...base, capacityKwh: null })).toBeNull();
    expect(estimateCharging({ ...base, vehicleMaxPowerKw: null })).toBeNull();
    expect(estimateCharging({ ...base, chargerPowerKw: 0 })).toBeNull();
    expect(estimateCharging({ ...base, initialSoc: 80, targetSoc: 20 })).toBeNull();
    expect(estimateCharging({ ...base, targetSoc: 120 })).toBeNull();
  });
});

describe('isValidSocRange', () => {
  it('requires target above initial inside 0-100', () => {
    expect(isValidSocRange(0, 100)).toBe(true);
    expect(isValidSocRange(50, 50)).toBe(false);
    expect(isValidSocRange(-1, 50)).toBe(false);
    expect(isValidSocRange(10, 101)).toBe(false);
  });
});

describe('estimateChargingByPower', () => {
  it('returns one point per valid power', () => {
    const { chargerPowerKw: _ignored, ...input } = base;
    void _ignored;
    const points = estimateChargingByPower(input, [3.7, 7.4, 22, 0]);
    expect(points.map((point) => point.powerKw)).toEqual([3.7, 7.4, 22]);
    expect(points[2].effectivePowerKw).toBe(11);
  });
});

describe('getReportedChargingTimes', () => {
  it('flattens manufacturer values for AC and DC', () => {
    const vehicle = createVehicle({
      charging: {
        charging_time: {
          ac: [{ power_kw: 11, from_soc_percent: 0, to_soc_percent: 100, time_min: 480 }],
          dc: [{ charger_power_kw: 150, from_soc_percent: 10, to_soc_percent: 80, time_min: 38 }],
        },
      },
    });
    expect(getReportedChargingTimes(vehicle)).toEqual([
      { type: 'ac', chargerPowerKw: 11, fromSoc: 0, toSoc: 100, minutes: 480 },
      { type: 'dc', chargerPowerKw: 150, fromSoc: 10, toSoc: 80, minutes: 38 },
    ]);
  });

  it('returns an empty list when nothing is reported', () => {
    expect(getReportedChargingTimes(createVehicle())).toEqual([]);
  });
});
