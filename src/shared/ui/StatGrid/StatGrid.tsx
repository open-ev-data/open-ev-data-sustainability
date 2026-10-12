import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import styles from './StatGrid.module.css';

export interface StatGridProps {
  children: ReactNode;
  minWidth?: number;
  className?: string;
}

export const StatGrid = ({ children, minWidth = 170, className }: StatGridProps) => {
  return (
    <div
      className={cn(styles.grid, className)}
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minWidth}px), 1fr))` }}
    >
      {children}
    </div>
  );
};
