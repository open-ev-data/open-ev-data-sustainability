import { Wallet } from 'lucide-react';
import type { CostEstimate } from '@/features/cost-calculator';
import { accumulateMonthly, type EnergyEstimate } from '@/features/energy-calculator';
import type { UsageProfile } from '@/features/usage-profile';
import { ChartCard, LineChart, Notice, SectionCard, StatCard, StatGrid } from '@/shared/ui';
import { formatCurrency } from '@/shared/lib/format';

interface CostPanelProps {
  profile: UsageProfile;
  energy: EnergyEstimate | null;
  cost: CostEstimate;
}

export function CostPanel({ profile, energy, cost }: CostPanelProps) {
  const money = (value: number | null) =>
    value === null ? null : formatCurrency(value, profile.currency, 'en-US', 2);

  const hasPrice = profile.pricePerKwh > 0;
  const series =
    cost.perMonth === null
      ? []
      : accumulateMonthly(cost.perMonth).map((point) => ({
          month: point.month,
          cost: Number(point.value.toFixed(2)),
        }));

  return (
    <SectionCard
      id="cost"
      title="Cost estimator"
      description="What the electricity costs at the price you pay."
      icon={<Wallet size={20} />}
    >
      {!hasPrice && (
        <Notice>
          Enter your electricity price per kWh in the usage profile to see costs. No tariff is
          assumed.
        </Notice>
      )}
      {hasPrice && !energy && (
        <Notice tone="warning">
          Insufficient data. Driving costs need the energy consumption; the cost per charge is still
          shown when charging can be estimated.
        </Notice>
      )}

      <StatGrid>
        <StatCard
          label="Per 100 km"
          value={money(cost.per100km)}
          hint="Cost to drive 100 km: energy per 100 km multiplied by your price per kWh."
        />
        <StatCard
          label="Per month"
          value={money(cost.perMonth)}
          hint="Average monthly electricity cost for the distance you entered."
        />
        <StatCard
          label="Per year"
          value={money(cost.perYear)}
          tone="highlight"
          hint="Yearly electricity cost for the distance you entered."
        />
        <StatCard
          label="Per charge"
          value={money(cost.perCharge)}
          hint="Cost of the charging session configured above, from the initial to the desired charge."
        />
      </StatGrid>

      {series.length > 0 && (
        <ChartCard
          title="Accumulated cost over a year"
          note="Excludes charging losses, fees and any change in tariff."
        >
          <LineChart
            data={series}
            xAxisKey="month"
            lines={[{ key: 'cost', color: 'var(--chart-yellow)', name: profile.currency }]}
            height={220}
            tooltipFormatter={(value) => [
              formatCurrency(Number(value), profile.currency, 'en-US', 2),
              'Cost',
            ]}
          />
        </ChartCard>
      )}
    </SectionCard>
  );
}
