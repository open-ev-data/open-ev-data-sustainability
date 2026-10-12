import type { Vehicle } from '../../model/vehicle.types';
import {
  getBatteryCapacityKwh,
  getMaxAcPowerKw,
  getMaxDcPowerKw,
  getRatedRanges,
} from '../../model/vehicle.helpers';
import { VehicleImage } from '../VehicleImage/VehicleImage';
import { VehicleTitle } from '../VehicleTitle/VehicleTitle';
import { formatDistance, formatEnergy, formatPower } from '@/shared/lib/format';
import styles from './VehicleSummary.module.css';

interface VehicleSummaryProps {
  vehicle: Vehicle;
}

export const VehicleSummary = ({ vehicle }: VehicleSummaryProps) => {
  const battery = getBatteryCapacityKwh(vehicle);
  const range = getRatedRanges(vehicle)[0];
  const ac = getMaxAcPowerKw(vehicle);
  const dc = getMaxDcPowerKw(vehicle);

  const specs = [
    battery !== null && { label: 'Battery (net)', value: formatEnergy(battery) },
    range && {
      label: `Range (${range.cycle.toUpperCase()})`,
      value: formatDistance(range.range_km),
    },
    ac !== null && { label: 'AC charging', value: formatPower(ac) },
    dc !== null && { label: 'DC charging', value: formatPower(dc) },
  ].filter((spec): spec is { label: string; value: string } => spec !== false);

  return (
    <div className={styles.summary}>
      <VehicleImage vehicle={vehicle} />
      <VehicleTitle vehicle={vehicle} as="h3" className={styles.title} />
      {specs.length > 0 && (
        <dl className={styles.specs}>
          {specs.map((spec) => (
            <div key={spec.label} className={styles.spec}>
              <dt className={styles.label}>{spec.label}</dt>
              <dd className={styles.value}>{spec.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
};
