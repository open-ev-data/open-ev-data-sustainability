import { Gauge } from 'lucide-react';
import type { Vehicle } from '@/entities/vehicle';
import {
  accumulateMonthly,
  getDerivedConsumptions,
  type Consumption,
  type EnergyEstimate,
} from '@/features/energy-calculator';
import type { ProfileRangeCycle } from '@/features/usage-profile';
import {
  BarChart,
  ChartCard,
  LineChart,
  Notice,
  SectionCard,
  Select,
  StatCard,
  StatGrid,
} from '@/shared/ui';
import { formatNumber } from '@/shared/lib/format';
import styles from './EnergyPanel.module.css';

interface EnergyPanelProps {
  vehicle: Vehicle;
  consumption: Consumption | null;
  energy: EnergyEstimate | null;
  cycle: ProfileRangeCycle;
  onCycleChange: (cycle: ProfileRangeCycle) => void;
}

const kwh = (value: number, digits = 1) =>
  formatNumber(value, 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export function EnergyPanel({ vehicle, consumption, energy, cycle, onCycleChange }: EnergyPanelProps) {
  const derived = getDerivedConsumptions(vehicle);

  const cycleOptions = [
    { value: 'auto', label: 'Automatic' },
    ...derived.map((item) => ({
      value: item.cycle as string,
      label: `${(item.cycle as string).toUpperCase()} (${formatNumber(item.rangeKm ?? 0)} km)`,
    })),
  ];

  const cycleData = derived.map((item) => ({
    cycle: (item.cycle as string).toUpperCase(),
    consumption: Number((item.whPerKm / 10).toFixed(2)),
  }));

  const monthlyData = energy
    ? accumulateMonthly(energy.perMonthKwh).map((point) => ({
        month: point.month,
        energy: Number(point.value.toFixed(1)),
      }))
    : [];

  return (
    <SectionCard
      id="energy"
      title="Energy consumption"
      description="How much electricity this vehicle uses for the distance you drive."
      icon={<Gauge size={20} />}
      actions={
        derived.length > 0 ? (
          <div className={styles.cycle}>
            <span className={styles.cycleLabel}>Range basis</span>
            <Select
              options={cycleOptions}
              value={cycle}
              onChange={(value) => onCycleChange(value as ProfileRangeCycle)}
            />
          </div>
        ) : undefined
      }
    >
      {consumption === null ? (
        <Notice tone="warning">
          Insufficient data. Consumption needs the net battery capacity and a homologated range, and
          this vehicle does not report them for the selected basis.
        </Notice>
      ) : (
        <Notice>
          {consumption.source === 'reported'
            ? `Using the consumption reported for this vehicle: ${formatNumber(consumption.whPerKm, 'en-US', { maximumFractionDigits: 1 })} Wh/km.`
            : `The dataset does not report consumption for this vehicle, so it is derived from the net battery (${kwh(
                (consumption.whPerKm * (consumption.rangeKm ?? 0)) / 1000
              )} kWh) divided by the ${(consumption.cycle as string).toUpperCase()} range of ${formatNumber(
                consumption.rangeKm ?? 0
              )} km. Real-world use is usually higher.`}
        </Notice>
      )}

      <StatGrid>
        <StatCard
          label="Per 100 km"
          value={energy ? kwh(energy.per100kmKwh) : null}
          unit="kWh"
          hint="Energy needed to drive 100 km. Lower is better, similar to liters per 100 km for a petrol car."
          tone="highlight"
        />
        <StatCard
          label="Per month"
          value={energy ? kwh(energy.perMonthKwh, 0) : null}
          unit="kWh"
          hint="Average electricity used in a month for the distance you entered."
        />
        <StatCard
          label="Per year"
          value={energy ? kwh(energy.perYearKwh, 0) : null}
          unit="kWh"
          hint="Total electricity used in a year. A typical household uses several thousand kWh per year."
        />
      </StatGrid>

      <div className={styles.charts}>
        {cycleData.length > 1 && (
          <ChartCard
            title="Consumption by range basis"
            note="Each homologated cycle gives a different range, so the derived consumption changes with it."
          >
            <BarChart
              data={cycleData}
              xAxisKey="cycle"
              bars={[{ key: 'consumption', name: 'kWh/100 km', color: 'var(--chart-cyan)' }]}
              height={220}
              tooltipFormatter={(value) => [`${value} kWh/100 km`, 'Consumption']}
            />
          </ChartCard>
        )}
        {energy && (
          <ChartCard title="Accumulated energy over a year" note="Assumes the same distance every month.">
            <LineChart
              data={monthlyData}
              xAxisKey="month"
              lines={[{ key: 'energy', color: 'var(--chart-green)', name: 'kWh' }]}
              height={220}
              tooltipFormatter={(value) => [`${value} kWh`, 'Energy']}
            />
          </ChartCard>
        )}
      </div>
    </SectionCard>
  );
}
