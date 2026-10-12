import { useMemo } from 'react';
import { useVehicles } from './use-vehicles';
import type { SlugName } from '../model/vehicle.types';

export function useMakes() {
  const { data: vehicles, isLoading, error } = useVehicles();

  const makes = useMemo(() => {
    if (!vehicles) return [];

    const uniqueMakesMap = new Map<string, SlugName>();

    vehicles.forEach((vehicle) => {
      if (!uniqueMakesMap.has(vehicle.make.slug)) {
        uniqueMakesMap.set(vehicle.make.slug, vehicle.make);
      }
    });

    return Array.from(uniqueMakesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [vehicles]);

  return { makes, isLoading, error };
}
