import type { Vehicle } from '@/entities/vehicle';
import { getVehicleTitle } from '@/entities/vehicle';

export interface SelectorOption {
  value: string;
  label: string;
}

function isNamed(name: string | undefined): name is string {
  return Boolean(name) && name !== 'Base';
}

/**
 * Builds the label that tells apart the versions of the same model and year.
 */
export function getVersionLabel(vehicle: Vehicle): string {
  const parts = [vehicle.variant?.name, vehicle.trim?.name].filter(isNamed);
  return Array.from(new Set(parts)).join(' / ') || 'Base';
}

export function getMakeOptions(vehicles: Vehicle[]): SelectorOption[] {
  const makes = new Map<string, string>();
  vehicles.forEach((vehicle) => makes.set(vehicle.make.slug, vehicle.make.name));

  return Array.from(makes, ([value, label]) => ({ value, label })).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}

export function getModelOptions(vehicles: Vehicle[], make?: string): SelectorOption[] {
  if (!make) return [];

  const models = new Map<string, string>();
  vehicles
    .filter((vehicle) => vehicle.make.slug === make)
    .forEach((vehicle) => models.set(vehicle.model.slug, vehicle.model.name));

  return Array.from(models, ([value, label]) => ({ value, label })).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}

export function getYearOptions(vehicles: Vehicle[], make?: string, model?: string): SelectorOption[] {
  if (!make || !model) return [];

  const years = new Set(
    vehicles
      .filter((vehicle) => vehicle.make.slug === make && vehicle.model.slug === model)
      .map((vehicle) => vehicle.year)
  );

  return Array.from(years)
    .sort((a, b) => b - a)
    .map((year) => ({ value: String(year), label: String(year) }));
}

export function getVersionOptions(
  vehicles: Vehicle[],
  make?: string,
  model?: string,
  year?: number
): SelectorOption[] {
  if (!make || !model || !year) return [];

  return vehicles
    .filter(
      (vehicle) =>
        vehicle.make.slug === make && vehicle.model.slug === model && vehicle.year === year
    )
    .map((vehicle) => ({ value: vehicle.unique_code, label: getVersionLabel(vehicle) }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Finds vehicles whose title contains every word of the query.
 */
export function searchVehicles(vehicles: Vehicle[], query: string, limit = 8): Vehicle[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  return vehicles
    .filter((vehicle) => {
      const title = `${getVehicleTitle(vehicle)} ${vehicle.trim?.name ?? ''}`.toLowerCase();
      return tokens.every((token) => title.includes(token));
    })
    .slice(0, limit);
}
