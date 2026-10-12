import {
  Battery,
  CircuitBoard,
  FlaskConical,
  House,
  Network,
  Plug,
  Sparkles,
  Thermometer,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { Vehicle } from '@/entities/vehicle';
import { Badge, SectionCard, Unavailable } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { getTechnologyItems } from '../model/technologies';
import styles from './EnergyTechnologies.module.css';

const ICONS: Record<string, ReactNode> = {
  v2l: <Plug size={20} />,
  v2h: <House size={20} />,
  v2g: <Network size={20} />,
  chemistry: <FlaskConical size={20} />,
  capacity: <Battery size={20} />,
  'heat-pump': <Thermometer size={20} />,
  architecture: <CircuitBoard size={20} />,
};

export function EnergyTechnologies({ vehicle }: { vehicle: Vehicle }) {
  const items = getTechnologyItems(vehicle);

  return (
    <SectionCard
      id="technologies"
      title="Energy technologies"
      description="What this vehicle can do beyond driving, based only on what the dataset reports."
      icon={<Sparkles size={20} />}
    >
      <ul className={styles.grid}>
        {items.map((item) => (
          <li key={item.key} className={cn(styles.card, item.tone === 'positive' && styles.positive)}>
            <div className={styles.header}>
              <span className={styles.icon}>{ICONS[item.key]}</span>
              <h3 className={styles.title}>{item.title}</h3>
            </div>
            <div className={styles.value}>
              {item.value === null ? (
                <Unavailable label="Not reported" />
              ) : item.key === 'v2l' || item.key === 'v2h' || item.key === 'v2g' ? (
                <Badge variant={item.tone === 'positive' ? 'success' : 'neutral'}>{item.value}</Badge>
              ) : (
                <span className={styles.valueText}>{item.value}</span>
              )}
              {item.detail && <span className={styles.detail}>{item.detail}</span>}
            </div>
            <p className={styles.description}>{item.description}</p>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
