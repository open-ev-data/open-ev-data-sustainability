import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVehicles } from '@/entities/vehicle';
import type { Vehicle } from '@/entities/vehicle';

export const VEHICLE_PARAM = 'vehicle';

const NO_VEHICLES: Vehicle[] = [];

/**
 * Reads the vehicle chosen through the `vehicle` URL parameter.
 */
export function useSelectedVehicle() {
  const { data, isLoading, error, refetch } = useVehicles();
  const vehicles = data ?? NO_VEHICLES;
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCode = searchParams.get(VEHICLE_PARAM);
  const selected = useMemo(
    () => vehicles.find((vehicle) => vehicle.unique_code === selectedCode),
    [vehicles, selectedCode]
  );

  return {
    vehicles,
    selected,
    selectedCode,
    isLoading,
    error: error as Error | null,
    refetch,
    setSearchParams,
  };
}
