import { Battery, Car, Coins, Gauge, Leaf, Plug, Route, Zap } from 'lucide-react';
import type { Vehicle } from '@/entities/vehicle';
import { getBatteryCapacityKwh, getMaxAcPowerKw, getVehicleTitle } from '@/entities/vehicle';
import type { CostEstimate } from '@/features/cost-calculator';
import type { Consumption, EnergyEstimate } from '@/features/energy-calculator';
import type { UsageProfile } from '@/features/usage-profile';
import { SectionCard, StatCard, StatGrid } from '@/shared/ui';
import { formatCurrency, formatDistance, formatEnergy, formatPower } from '@/shared/lib/format';

interface SustainabilitySummaryProps {
  vehicle: Vehicle;
  profile: UsageProfile;
  energy: EnergyEstimate | null;
  consumption: Consumption | null;
  cost: CostEstimate;
}

function bidirectionalValue(feature: { supported: boolean; max_power_kw?: number } | undefined) {
  if (!feature) return { value: null, caption: undefined };
  if (!feature.supported) return { value: 'Not supported', caption: undefined };
  return {
    value: 'Supported',
    caption: feature.max_power_kw ? `Up to ${formatPower(feature.max_power_kw)}` : undefined,
  };
}

export function SustainabilitySummary({
  vehicle,
  profile,
  energy,
  consumption,
  cost,
}: SustainabilitySummaryProps) {
  const ac = getMaxAcPowerKw(vehicle);
  const battery = getBatteryCapacityKwh(vehicle);
  const v2l = bidirectionalValue(vehicle.v2x?.v2l);
  const v2g = bidirectionalValue(vehicle.v2x?.v2g);

  const basis =
    consumption?.source === 'derived'
      ? `Derived from the ${(consumption.cycle as string).toUpperCase()} range`
      : consumption
        ? 'Reported by the manufacturer'
        : undefined;

  return (
    <SectionCard
      id="summary"
      title="Sustainability summary"
      description={getVehicleTitle(vehicle)}
      icon={<Leaf size={20} />}
    >
      <StatGrid minWidth={190}>
        <StatCard
          label="Annual distance"
          icon={<Route size={16} />}
          value={energy ? formatDistance(Math.round(energy.annualKm)) : null}
        />
        <StatCard
          label="Energy per year"
          icon={<Zap size={16} />}
          value={energy ? formatEnergy(energy.perYearKwh, 0) : null}
        />
        <StatCard
          label="Energy per 100 km"
          icon={<Gauge size={16} />}
          value={energy ? formatEnergy(energy.per100kmKwh) : null}
          caption={basis}
          tone="highlight"
        />
        <StatCard
          label="Cost per year"
          icon={<Coins size={16} />}
          value={cost.perYear === null ? null : formatCurrency(cost.perYear, profile.currency, 'en-US', 2)}
          unavailableLabel={profile.pricePerKwh > 0 ? undefined : 'Enter a price'}
        />
        <StatCard
          label="AC charging"
          icon={<Plug size={16} />}
          value={ac === null ? null : formatPower(ac)}
        />
        <StatCard
          label="Battery"
          icon={<Battery size={16} />}
          value={battery === null ? null : formatEnergy(battery)}
          caption="Net capacity"
        />
        <StatCard
          label="V2L"
          icon={<Car size={16} />}
          value={v2l.value}
          caption={v2l.caption}
          unavailableLabel="Not reported"
          hint="Vehicle to Load: powering appliances from the car."
        />
        <StatCard
          label="V2G"
          icon={<Car size={16} />}
          value={v2g.value}
          caption={v2g.caption}
          unavailableLabel="Not reported"
          hint="Vehicle to Grid: sending energy from the car back to the grid."
        />
      </StatGrid>
    </SectionCard>
  );
}
