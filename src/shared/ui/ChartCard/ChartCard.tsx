import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import styles from './ChartCard.module.css';

export interface ChartCardProps {
  title: string;
  note?: string;
  children: ReactNode;
  className?: string;
}

export const ChartCard = ({ title, note, children, className }: ChartCardProps) => {
  return (
    <figure className={cn(styles.card, className)}>
      <figcaption className={styles.title}>{title}</figcaption>
      <div className={styles.chart}>{children}</div>
      {note && <p className={styles.note}>{note}</p>}
    </figure>
  );
};
