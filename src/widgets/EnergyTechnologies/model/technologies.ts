import type { Vehicle } from '@/entities/vehicle';
import { formatEnergy, formatPower } from '@/shared/lib/format';

export type TechnologyTone = 'positive' | 'neutral';

export interface TechnologyItem {
  key: string;
  title: string;
  value: string | null;
  tone: TechnologyTone;
  detail: string | null;
  description: string;
}

interface BidirectionalFeature {
  supported: boolean;
  max_power_kw?: number;
  connector?: string;
  protocols?: string[];
}

const CHEMISTRY_LABELS: Record<string, string> = {
  lfp: 'LFP (lithium iron phosphate)',
  nmc: 'NMC (nickel manganese cobalt)',
  nca: 'NCA (nickel cobalt aluminium)',
  'li-ion': 'Lithium-ion',
};

function joinDetails(parts: (string | null | undefined)[]): string | null {
  const details = parts.filter((part): part is string => Boolean(part));
  return details.length > 0 ? details.join(' - ') : null;
}

function bidirectional(
  key: string,
  title: string,
  description: string,
  feature: BidirectionalFeature | undefined,
  extra: (string | null)[] = []
): TechnologyItem {
  return {
    key,
    title,
    value: feature ? (feature.supported ? 'Supported' : 'Not supported') : null,
    tone: feature?.supported ? 'positive' : 'neutral',
    detail: feature?.supported
      ? joinDetails([
          feature.max_power_kw ? `Up to ${formatPower(feature.max_power_kw)}` : null,
          feature.connector,
          feature.protocols?.length ? feature.protocols.join(', ') : null,
          ...extra,
        ])
      : null,
    description,
  };
}

export function formatChemistry(chemistry: string): string {
  return CHEMISTRY_LABELS[chemistry.toLowerCase()] ?? chemistry.toUpperCase();
}

/**
 * Builds the educational technology cards from the fields present in the dataset.
 * A field the dataset does not report has a null value and is shown as unavailable.
 */
export function getTechnologyItems(vehicle: Vehicle): TechnologyItem[] {
  const battery = vehicle.battery;
  const v2l = vehicle.v2x?.v2l;
  const dc = vehicle.charging?.dc;

  const outlets = v2l?.outlets
    ?.map((outlet) => `${outlet.count ?? 1} x ${outlet.kind.replace(/_/g, ' ')}`)
    .join(', ');

  const capacityNet = battery?.pack_capacity_kwh_net;
  const capacityGross = battery?.pack_capacity_kwh_gross;

  return [
    bidirectional(
      'v2l',
      'V2L - Vehicle to Load',
      'The car acts as a big power bank: you can run appliances, tools or camping gear from an outlet on the vehicle.',
      v2l,
      [outlets ?? null]
    ),
    bidirectional(
      'v2h',
      'V2H - Vehicle to Home',
      'During a power outage the battery can supply your home through a compatible bidirectional charger.',
      vehicle.v2x?.v2h
    ),
    bidirectional(
      'v2g',
      'V2G - Vehicle to Grid',
      'The car can send energy back to the electricity grid, helping balance demand when parked and plugged in.',
      vehicle.v2x?.v2g
    ),
    {
      key: 'chemistry',
      title: 'Battery chemistry',
      value: battery?.chemistry ? formatChemistry(battery.chemistry) : null,
      tone: 'neutral',
      detail: battery?.cathode_material ?? null,
      description:
        'The materials inside the cells. Chemistry influences cost, durability, weight and how the battery likes to be charged.',
    },
    {
      key: 'capacity',
      title: 'Battery capacity',
      value: typeof capacityNet === 'number' ? formatEnergy(capacityNet) : null,
      tone: 'neutral',
      detail:
        typeof capacityGross === 'number' && capacityGross !== capacityNet
          ? `${formatEnergy(capacityGross)} gross`
          : null,
      description:
        'Net capacity is the energy you can actually use. Gross includes a reserve the car keeps to protect the battery.',
    },
    {
      key: 'heat-pump',
      title: 'Heat pump',
      value: typeof battery?.heat_pump === 'boolean' ? (battery.heat_pump ? 'Included' : 'Not included') : null,
      tone: battery?.heat_pump ? 'positive' : 'neutral',
      detail: null,
      description:
        'A heat pump warms the cabin using far less energy than a resistive heater, which saves range in cold weather.',
    },
    {
      key: 'architecture',
      title: 'Charging architecture',
      value: dc?.architecture_voltage_class ? dc.architecture_voltage_class.toUpperCase().replace('V', ' V') : null,
      tone: dc?.architecture_voltage_class === '800v' ? 'positive' : 'neutral',
      detail: dc?.max_power_kw ? `Up to ${formatPower(dc.max_power_kw)} DC` : null,
      description:
        'The battery voltage class. Higher-voltage systems can carry more power at lower current, which enables faster charging.',
    },
  ];
}
