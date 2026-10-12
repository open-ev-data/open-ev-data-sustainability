import type { Vehicle } from '../../model/vehicle.types';
import { generateMakeHue } from '@/shared/lib/color-generator';

interface VehicleTitleProps {
  vehicle: Vehicle;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
  layout?: 'flow' | 'multiline';
}

export function VehicleTitle({
  vehicle,
  className,
  as: Component = 'span',
  layout = 'flow',
}: VehicleTitleProps) {
  const makeName = vehicle.make.name;
  const modelName = vehicle.model.name;
  const variantName = vehicle.variant?.name === 'Base' ? '' : vehicle.variant?.name;
  const year = vehicle.year;

  const hue = generateMakeHue(makeName);

  return (
    <Component
      className={className}
      style={{ display: layout === 'multiline' ? 'flex' : 'inline', flexDirection: 'column' }}
    >
      <span
        style={{
          color: `hsl(${hue}, 100%, 50%)`,
          textShadow: `0 0 10px hsla(${hue}, 100%, 50%, 0.3)`,
          fontWeight: 'bold',
          display: layout === 'multiline' ? 'block' : 'inline',
        }}
      >
        {makeName}
      </span>
      <span style={{ fontWeight: layout === 'multiline' ? 'bold' : 'normal' }}>
        {layout === 'multiline' ? '' : ' '}
        {`${modelName}${variantName ? ` ${variantName}` : ''} ${year}`}
      </span>
    </Component>
  );
}
