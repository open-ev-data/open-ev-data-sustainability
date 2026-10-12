import type { Vehicle } from '@/entities/vehicle';

export type PowerLimit = 'charger' | 'vehicle' | 'none';

export interface ChargingInput {
  capacityKwh: number | null;
  initialSoc: number;
  targetSoc: number;
  chargerPowerKw: number;
  vehicleMaxPowerKw: number | null;
}

export interface ChargingEstimate {
  energyNeededKwh: number;
  effectivePowerKw: number;
  limitedBy: PowerLimit;
  hours: number;
}

export interface PowerTimePoint {
  powerKw: number;
  effectivePowerKw: number;
  hours: number;
}

export interface ReportedChargingTime {
  type: 'ac' | 'dc';
  chargerPowerKw: number | null;
  fromSoc: number;
  toSoc: number;
  minutes: number;
}

export function isValidSocRange(initialSoc: number, targetSoc: number): boolean {
  return (
    Number.isFinite(initialSoc) &&
    Number.isFinite(targetSoc) &&
    initialSoc >= 0 &&
    targetSoc <= 100 &&
    targetSoc > initialSoc
  );
}

/**
 * Estimates the charging session.
 *
 * energy_needed = battery_capacity x (target_soc - initial_soc)
 * effective_power = min(charger_power, vehicle_max_power)
 * charging_time = energy_needed / effective_power
 *
 * Returns null when any required input is missing or invalid.
 */
export function estimateCharging(input: ChargingInput): ChargingEstimate | null {
  const { capacityKwh, initialSoc, targetSoc, chargerPowerKw, vehicleMaxPowerKw } = input;

  if (capacityKwh === null || vehicleMaxPowerKw === null) return null;
  if (!(capacityKwh > 0) || !(vehicleMaxPowerKw > 0) || !(chargerPowerKw > 0)) return null;
  if (!isValidSocRange(initialSoc, targetSoc)) return null;

  const energyNeededKwh = (capacityKwh * (targetSoc - initialSoc)) / 100;
  const effectivePowerKw = Math.min(chargerPowerKw, vehicleMaxPowerKw);

  let limitedBy: PowerLimit = 'none';
  if (chargerPowerKw < vehicleMaxPowerKw) limitedBy = 'charger';
  if (vehicleMaxPowerKw < chargerPowerKw) limitedBy = 'vehicle';

  return {
    energyNeededKwh,
    effectivePowerKw,
    limitedBy,
    hours: energyNeededKwh / effectivePowerKw,
  };
}

/**
 * Estimates the charging time of the same session for several charger powers.
 */
export function estimateChargingByPower(
  input: Omit<ChargingInput, 'chargerPowerKw'>,
  powersKw: number[]
): PowerTimePoint[] {
  return powersKw
    .map((powerKw) => {
      const estimate = estimateCharging({ ...input, chargerPowerKw: powerKw });
      return estimate
        ? { powerKw, effectivePowerKw: estimate.effectivePowerKw, hours: estimate.hours }
        : null;
    })
    .filter((point): point is PowerTimePoint => point !== null);
}

/**
 * Flattens the charging times reported by the manufacturer, if any.
 */
export function getReportedChargingTimes(vehicle: Vehicle): ReportedChargingTime[] {
  const reported = vehicle.charging?.charging_time;
  if (!reported) return [];

  const toEntries = (type: 'ac' | 'dc'): ReportedChargingTime[] =>
    (reported[type] ?? []).map((entry) => ({
      type,
      chargerPowerKw: entry.power_kw ?? entry.charger_power_kw ?? null,
      fromSoc: entry.from_soc_percent,
      toSoc: entry.to_soc_percent,
      minutes: entry.time_min,
    }));

  return [...toEntries('ac'), ...toEntries('dc')];
}
