import type { RangeRated, Vehicle } from '@/entities/vehicle';
import { getBatteryCapacityKwh, getRatedRanges } from '@/entities/vehicle';
import type { DistancePeriod } from '@/shared/types';

export const DAYS_PER_YEAR = 365;
export const MONTHS_PER_YEAR = 12;

export type RangeCycle = RangeRated['cycle'];
export type CycleSelection = RangeCycle | 'auto';
export type ConsumptionSource = 'reported' | 'derived';

export interface Consumption {
  whPerKm: number;
  source: ConsumptionSource;
  cycle: RangeCycle | null;
  rangeKm: number | null;
}

export interface EnergyEstimate {
  annualKm: number;
  per100kmKwh: number;
  perMonthKwh: number;
  perYearKwh: number;
}

export interface MonthlyPoint {
  month: string;
  value: number;
}

function reportedConsumption(vehicle: Vehicle): Consumption | null {
  const reported = vehicle.efficiency?.energy_consumption_wh_per_km;
  if (typeof reported !== 'number' || reported <= 0) return null;
  return { whPerKm: reported, source: 'reported', cycle: null, rangeKm: null };
}

function derivedConsumption(vehicle: Vehicle, cycle: RangeCycle): Consumption | null {
  const capacityKwh = getBatteryCapacityKwh(vehicle);
  const rated = getRatedRanges(vehicle).find((entry) => entry.cycle === cycle);
  if (capacityKwh === null || !rated) return null;

  return {
    whPerKm: (capacityKwh * 1000) / rated.range_km,
    source: 'derived',
    cycle,
    rangeKm: rated.range_km,
  };
}

/**
 * Lists the consumption derived from the net battery capacity and each
 * homologated range cycle available for the vehicle.
 */
export function getDerivedConsumptions(vehicle: Vehicle): Consumption[] {
  const cycles = Array.from(new Set(getRatedRanges(vehicle).map((entry) => entry.cycle)));
  return cycles
    .map((cycle) => derivedConsumption(vehicle, cycle))
    .filter((item): item is Consumption => item !== null);
}

/**
 * Resolves the energy consumption of a vehicle in Wh/km.
 *
 * With `auto` the reported `efficiency.energy_consumption_wh_per_km` wins; without it,
 * the value is derived from net battery capacity divided by the best homologated range.
 * An explicit cycle always derives from that cycle. Returns null when data is missing.
 */
export function resolveConsumption(
  vehicle: Vehicle,
  selection: CycleSelection = 'auto'
): Consumption | null {
  if (selection !== 'auto') return derivedConsumption(vehicle, selection);

  const reported = reportedConsumption(vehicle);
  if (reported) return reported;

  return getDerivedConsumptions(vehicle)[0] ?? null;
}

export function toAnnualDistanceKm(distance: number, period: DistancePeriod): number {
  if (period === 'day') return distance * DAYS_PER_YEAR;
  if (period === 'month') return distance * MONTHS_PER_YEAR;
  return distance;
}

export function estimateEnergy(
  consumption: Consumption | null,
  distance: number,
  period: DistancePeriod
): EnergyEstimate | null {
  if (!consumption || !Number.isFinite(distance) || distance <= 0) return null;

  const annualKm = toAnnualDistanceKm(distance, period);
  const perYearKwh = (consumption.whPerKm * annualKm) / 1000;

  return {
    annualKm,
    per100kmKwh: consumption.whPerKm / 10,
    perMonthKwh: perYearKwh / MONTHS_PER_YEAR,
    perYearKwh,
  };
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Builds a 12-month accumulated series from a constant monthly value.
 */
export function accumulateMonthly(perMonth: number): MonthlyPoint[] {
  return MONTH_LABELS.map((month, index) => ({ month, value: perMonth * (index + 1) }));
}
