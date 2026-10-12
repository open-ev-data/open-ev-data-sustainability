import { useCallback } from 'react';
import { useVehicles } from './use-vehicles';
import type { Vehicle } from '../model/vehicle.types';

export function useVehicle(uniqueCode?: string) {
  const { data: vehicles, ...rest } = useVehicles();

  const selectVehicle = useCallback(
    (allVehicles: Vehicle[] | undefined) => {
      if (!allVehicles || !uniqueCode) return undefined;
      return allVehicles.find((v) => v.unique_code === uniqueCode);
    },
    [uniqueCode]
  );

  const vehicle = selectVehicle(vehicles);

  return {
    vehicle,
    ...rest,
  };
}
