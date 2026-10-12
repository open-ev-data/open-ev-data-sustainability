import { useMemo } from 'react';
import type { Vehicle } from '@/entities/vehicle';
import { getBatteryCapacityKwh, getMaxAcPowerKw, getMaxDcPowerKw } from '@/entities/vehicle';
import type { UsageProfile, UsageProfileErrors } from '@/features/usage-profile';
import { estimateEnergy, resolveConsumption } from '@/features/energy-calculator';
import { estimateCharging } from '@/features/charging-calculator';
import { estimateCost } from '@/features/cost-calculator';

/**
 * Combines the selected vehicle and the usage profile into every figure shown on the page.
 * Each figure is null when the dataset or the profile does not allow a trustworthy value.
 */
export function useSustainabilityModel(
  vehicle: Vehicle | undefined,
  profile: UsageProfile,
  errors: UsageProfileErrors
) {
  return useMemo(() => {
    if (!vehicle) return null;

    const consumption = resolveConsumption(vehicle, profile.rangeCycle);
    const energy = errors.distance
      ? null
      : estimateEnergy(consumption, profile.distance, profile.distancePeriod);

    const capacityKwh = getBatteryCapacityKwh(vehicle);
    const vehicleMaxPowerKw =
      profile.chargerType === 'ac' ? getMaxAcPowerKw(vehicle) : getMaxDcPowerKw(vehicle);

    const charging = estimateCharging({
      capacityKwh,
      initialSoc: profile.initialSoc,
      targetSoc: profile.targetSoc,
      chargerPowerKw: profile.chargerPowerKw,
      vehicleMaxPowerKw,
    });

    const cost = estimateCost({
      per100kmKwh: energy?.per100kmKwh ?? null,
      perMonthKwh: energy?.perMonthKwh ?? null,
      perYearKwh: energy?.perYearKwh ?? null,
      energyNeededKwh: charging?.energyNeededKwh ?? null,
      pricePerKwh: profile.pricePerKwh,
    });

    return { consumption, energy, capacityKwh, vehicleMaxPowerKw, charging, cost };
  }, [vehicle, profile, errors.distance]);
}

export type SustainabilityModel = NonNullable<ReturnType<typeof useSustainabilityModel>>;
