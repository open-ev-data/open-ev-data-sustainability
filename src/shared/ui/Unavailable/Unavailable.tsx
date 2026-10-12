import { cn } from '@/shared/lib/cn';
import styles from './Unavailable.module.css';

export interface UnavailableProps {
  label?: string;
  reason?: string;
  className?: string;
}

export const Unavailable = ({
  label = 'Insufficient data',
  reason,
  className,
}: UnavailableProps) => {
  return (
    <span className={cn(styles.unavailable, className)} title={reason}>
      {label}
    </span>
  );
};
