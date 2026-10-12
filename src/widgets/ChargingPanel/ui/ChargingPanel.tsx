import { BatteryCharging } from 'lucide-react';
import type { Vehicle } from '@/entities/vehicle';
import {
  estimateChargingByPower,
  getReportedChargingTimes,
  type ChargingEstimate,
} from '@/features/charging-calculator';
import { CHARGER_PRESETS_KW, type UsageProfile } from '@/features/usage-profile';
import { BarChart, ChartCard, Notice, SectionCard, StatCard, StatGrid } from '@/shared/ui';
import { formatDuration, formatEnergy, formatPower } from '@/shared/lib/format';
import styles from './ChargingPanel.module.css';

interface ChargingPanelProps {
  vehicle: Vehicle;
  profile: UsageProfile;
  capacityKwh: number | null;
  vehicleMaxPowerKw: number | null;
  charging: ChargingEstimate | null;
}

const LIMIT_CAPTION = {
  charger: 'Limited by your charger',
  vehicle: 'Limited by the vehicle',
  none: 'Charger and vehicle are matched',
} as const;

export function ChargingPanel({
  vehicle,
  profile,
  capacityKwh,
  vehicleMaxPowerKw,
  charging,
}: ChargingPanelProps) {
  const typeLabel = profile.chargerType.toUpperCase();
  const reported = getReportedChargingTimes(vehicle);

  const powers = Array.from(
    new Set([...CHARGER_PRESETS_KW[profile.chargerType], profile.chargerPowerKw])
  ).sort((a, b) => a - b);

  const chartData = estimateChargingByPower(
    {
      capacityKwh,
      initialSoc: profile.initialSoc,
      targetSoc: profile.targetSoc,
      vehicleMaxPowerKw,
    },
    powers
  ).map((point) => ({
    charger: `${point.powerKw} kW`,
    hours: Number(point.hours.toFixed(2)),
  }));

  const missing = vehicleMaxPowerKw === null
    ? `This vehicle does not report ${typeLabel} charging power, so the charging time cannot be estimated.`
    : capacityKwh === null
      ? 'This vehicle does not report its net battery capacity, so the charging time cannot be estimated.'
      : null;

  return (
    <SectionCard
      id="charging"
      title="Charging simulator"
      description={`Time to go from ${profile.initialSoc}% to ${profile.targetSoc}% on a ${formatPower(profile.chargerPowerKw)} ${typeLabel} charger.`}
      icon={<BatteryCharging size={20} />}
    >
      {missing && <Notice tone="warning">Insufficient data. {missing}</Notice>}

      <StatGrid>
        <StatCard
          label="Energy needed"
          value={charging ? formatEnergy(charging.energyNeededKwh) : null}
          hint="The electricity that has to go into the battery to reach your desired charge."
        />
        <StatCard
          label="Effective power"
          value={charging ? formatPower(charging.effectivePowerKw) : null}
          caption={charging ? LIMIT_CAPTION[charging.limitedBy] : undefined}
          hint="Charging is limited by the weaker of the charger and the vehicle's maximum accepted power."
        />
        <StatCard
          label="Charging time"
          value={charging ? formatDuration(charging.hours) : null}
          tone="highlight"
          hint="Estimated duration of the session at constant power."
        />
      </StatGrid>

      {charging && profile.chargerType === 'dc' && (
        <Notice>
          DC estimates assume the peak power for the whole session. Real fast charging slows down as
          the battery fills, so the actual time is longer.
        </Notice>
      )}

      {chartData.length > 1 && (
        <ChartCard
          title={`Charging time by ${typeLabel} charger power`}
          note="Same session, different chargers. Bars flatten once the vehicle's own limit is reached."
        >
          <BarChart
            data={chartData}
            xAxisKey="charger"
            bars={[{ key: 'hours', name: 'Hours', color: 'var(--chart-cyan)' }]}
            height={240}
            tooltipFormatter={(value) => [formatDuration(Number(value)), 'Charging time']}
          />
        </ChartCard>
      )}

      {reported.length > 0 && (
        <div className={styles.reported}>
          <h3 className={styles.reportedTitle}>Charging times reported by the manufacturer</h3>
          <ul className={styles.reportedList}>
            {reported.map((entry, index) => (
              <li key={`${entry.type}-${index}`} className={styles.reportedItem}>
                <span className={styles.reportedType}>{entry.type.toUpperCase()}</span>
                <span>
                  {entry.chargerPowerKw !== null ? `${formatPower(entry.chargerPowerKw)}, ` : ''}
                  {entry.fromSoc}% to {entry.toSoc}%
                </span>
                <strong>{formatDuration(entry.minutes / 60)}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SectionCard>
  );
}
