/**
 * Helper functions for vehicle domain entities.
 */
import type { RangeRated, Vehicle } from './vehicle.types';
import { getVehicleTypeImage } from '@/shared/lib/vehicle-image-mapper';

const RANGE_CYCLE_PRIORITY: RangeRated['cycle'][] = ['wltp', 'epa', 'cltc', 'nedc', 'jc08', 'other'];

/**
 * Generates a full display title for a vehicle.
 * Format: "Make Model Variant Year"
 */
export function getVehicleTitle(vehicle: Vehicle): string {
  const variantName = vehicle.variant?.name === 'Base' ? '' : vehicle.variant?.name;
  const parts = [vehicle.make.name, vehicle.model.name, variantName, vehicle.year];
  return parts.filter(Boolean).join(' ');
}

/**
 * Resolves the vehicle image URL with a type-based fallback.
 */
export function getVehicleImage(vehicle: Vehicle): string {
  return vehicle.images?.exterior_url || getVehicleTypeImage(vehicle.vehicle_type);
}

/**
 * Returns the usable net battery capacity in kWh, or null when not reported.
 */
export function getBatteryCapacityKwh(vehicle: Vehicle): number | null {
  const capacity = vehicle.battery?.pack_capacity_kwh_net;
  return typeof capacity === 'number' && capacity > 0 ? capacity : null;
}

/**
 * Returns the homologated ranges with a positive value, ordered by cycle
 * priority (WLTP, EPA, CLTC, NEDC, JC08, other).
 */
export function getRatedRanges(vehicle: Vehicle): RangeRated[] {
  const rated = vehicle.range?.rated ?? [];

  return rated
    .filter((entry) => typeof entry.range_km === 'number' && entry.range_km > 0)
    .sort(
      (a, b) => RANGE_CYCLE_PRIORITY.indexOf(a.cycle) - RANGE_CYCLE_PRIORITY.indexOf(b.cycle)
    );
}

/**
 * Returns the maximum AC charging power in kW, or null when not reported.
 */
export function getMaxAcPowerKw(vehicle: Vehicle): number | null {
  const power = vehicle.charging?.ac?.max_power_kw;
  return typeof power === 'number' && power > 0 ? power : null;
}

/**
 * Returns the maximum DC charging power in kW, or null when not reported.
 */
export function getMaxDcPowerKw(vehicle: Vehicle): number | null {
  const power = vehicle.charging?.dc?.max_power_kw;
  return typeof power === 'number' && power > 0 ? power : null;
}
