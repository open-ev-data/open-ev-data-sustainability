import type { RangeRated } from '@/entities/vehicle';
import type { ChargerType, DistancePeriod } from '@/shared/types';

export type ProfileRangeCycle = RangeRated['cycle'] | 'auto';

export interface UsageProfile {
  distance: number;
  distancePeriod: DistancePeriod;
  pricePerKwh: number;
  currency: string;
  initialSoc: number;
  targetSoc: number;
  chargerType: ChargerType;
  chargerPowerKw: number;
  rangeCycle: ProfileRangeCycle;
}

export type UsageProfileErrors = Partial<Record<keyof UsageProfile, string>>;

export const DEFAULT_CHARGER_POWER_KW: Record<ChargerType, number> = { ac: 7.4, dc: 150 };

export const CHARGER_PRESETS_KW: Record<ChargerType, number[]> = {
  ac: [2.3, 3.7, 7.4, 11, 22],
  dc: [50, 150, 350],
};

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'BRL', 'CNY', 'JPY', 'INR', 'CAD', 'AUD'] as const;

export const DEFAULT_USAGE_PROFILE: UsageProfile = {
  distance: 15000,
  distancePeriod: 'year',
  pricePerKwh: 0,
  currency: 'USD',
  initialSoc: 20,
  targetSoc: 80,
  chargerType: 'ac',
  chargerPowerKw: DEFAULT_CHARGER_POWER_KW.ac,
  rangeCycle: 'auto',
};

const DISTANCE_PERIODS: DistancePeriod[] = ['day', 'month', 'year'];
const CHARGER_TYPES: ChargerType[] = ['ac', 'dc'];
const RANGE_CYCLES: ProfileRangeCycle[] = ['auto', 'wltp', 'epa', 'nedc', 'cltc', 'jc08', 'other'];

const MAX_DISTANCE_PER_DAY = 2000;
const MAX_ANNUAL_DISTANCE = 1_000_000;

/**
 * Merges untrusted stored data with the defaults, keeping only values of the expected shape.
 */
export function sanitizeUsageProfile(raw: unknown): UsageProfile {
  if (!raw || typeof raw !== 'object') return DEFAULT_USAGE_PROFILE;

  const source = raw as Record<string, unknown>;
  const number = (key: keyof UsageProfile, fallback: number) =>
    typeof source[key] === 'number' && Number.isFinite(source[key]) ? (source[key] as number) : fallback;
  const pick = <T extends string>(key: keyof UsageProfile, allowed: readonly T[], fallback: T) =>
    allowed.includes(source[key] as T) ? (source[key] as T) : fallback;

  const defaults = DEFAULT_USAGE_PROFILE;

  return {
    distance: number('distance', defaults.distance),
    distancePeriod: pick('distancePeriod', DISTANCE_PERIODS, defaults.distancePeriod),
    pricePerKwh: number('pricePerKwh', defaults.pricePerKwh),
    currency: pick('currency', CURRENCIES, defaults.currency as (typeof CURRENCIES)[number]),
    initialSoc: number('initialSoc', defaults.initialSoc),
    targetSoc: number('targetSoc', defaults.targetSoc),
    chargerType: pick('chargerType', CHARGER_TYPES, defaults.chargerType),
    chargerPowerKw: number('chargerPowerKw', defaults.chargerPowerKw),
    rangeCycle: pick('rangeCycle', RANGE_CYCLES, defaults.rangeCycle),
  };
}

/**
 * Validates the profile and returns a message per invalid field.
 * An electricity price of 0 means "not informed" and is not an error.
 */
export function validateUsageProfile(profile: UsageProfile): UsageProfileErrors {
  const errors: UsageProfileErrors = {};

  if (!(profile.distance > 0)) {
    errors.distance = 'Enter a distance greater than zero.';
  } else if (profile.distancePeriod === 'day' && profile.distance > MAX_DISTANCE_PER_DAY) {
    errors.distance = `A daily distance above ${MAX_DISTANCE_PER_DAY} km is not realistic.`;
  } else if (profile.distance * (profile.distancePeriod === 'day' ? 365 : profile.distancePeriod === 'month' ? 12 : 1) > MAX_ANNUAL_DISTANCE) {
    errors.distance = 'This distance is too large to estimate.';
  }

  if (!(profile.pricePerKwh >= 0)) {
    errors.pricePerKwh = 'The price cannot be negative.';
  }

  if (profile.initialSoc < 0 || profile.initialSoc > 100) {
    errors.initialSoc = 'Use a value between 0 and 100.';
  }

  if (profile.targetSoc <= 0 || profile.targetSoc > 100) {
    errors.targetSoc = 'Use a value between 1 and 100.';
  } else if (profile.targetSoc <= profile.initialSoc) {
    errors.targetSoc = 'The desired charge must be higher than the initial charge.';
  }

  if (!(profile.chargerPowerKw > 0)) {
    errors.chargerPowerKw = 'Enter a charger power greater than zero.';
  }

  return errors;
}
