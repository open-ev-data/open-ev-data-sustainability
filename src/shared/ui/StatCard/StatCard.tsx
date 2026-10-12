import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { InfoHint } from '../InfoHint/InfoHint';
import { Unavailable } from '../Unavailable/Unavailable';
import styles from './StatCard.module.css';

export interface StatCardProps {
  label: string;
  value: string | null;
  unavailableLabel?: string;
  unit?: string;
  hint?: string;
  caption?: ReactNode;
  icon?: ReactNode;
  tone?: 'default' | 'highlight';
  className?: string;
}

export const StatCard = ({
  label,
  value,
  unavailableLabel,
  unit,
  hint,
  caption,
  icon,
  tone = 'default',
  className,
}: StatCardProps) => {
  return (
    <div className={cn(styles.card, tone === 'highlight' && styles.highlight, className)}>
      <div className={styles.header}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.label}>{label}</span>
        {hint && <InfoHint text={hint} label={`About ${label}`} />}
      </div>
      <div className={styles.value}>
        {value === null ? (
          <Unavailable label={unavailableLabel} />
        ) : (
          <>
            <span className={styles.number}>{value}</span>
            {unit && <span className={styles.unit}>{unit}</span>}
          </>
        )}
      </div>
      {caption && <div className={styles.caption}>{caption}</div>}
    </div>
  );
};
