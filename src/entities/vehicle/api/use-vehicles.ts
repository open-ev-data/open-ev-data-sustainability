import { useQuery } from '@tanstack/react-query';
import { APP_CONSTANTS } from '@/shared/config/constants';
import { fetchLatestVehicles } from './vehicle.api';

export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchLatestVehicles,
    staleTime: APP_CONSTANTS.CACHE.STALE_TIME_MS,
    gcTime: APP_CONSTANTS.CACHE.GC_TIME_MS,
    select: (data) => data.vehicles,
  });
}

export function useVehicleMetadata() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchLatestVehicles,
    staleTime: APP_CONSTANTS.CACHE.STALE_TIME_MS,
    gcTime: APP_CONSTANTS.CACHE.GC_TIME_MS,
    select: (data) => data.metadata,
  });
}
