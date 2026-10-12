import type { Vehicle } from '../../model/vehicle.types';
import { getVehicleTypeImage } from '@/shared/lib/vehicle-image-mapper';
import { getVehicleTitle } from '../../model/vehicle.helpers';
import { generateMakeHue } from '@/shared/lib/color-generator';
import styles from './VehicleImage.module.css';

interface VehicleImageProps {
  vehicle: Vehicle;
}

export const VehicleImage = ({ vehicle }: VehicleImageProps) => {
  // Use exterior_url if available, otherwise fallback to vehicle type image
  const imageUrl = vehicle.images?.exterior_url || getVehicleTypeImage(vehicle.vehicle_type);
  const altText = getVehicleTitle(vehicle);

  return (
    <div
      className={styles.container}
      style={{ '--vehicle-hue': generateMakeHue(vehicle.make.name) } as React.CSSProperties}
    >
      <img src={imageUrl} alt={altText} className={styles.image} loading="eager" />
    </div>
  );
};
