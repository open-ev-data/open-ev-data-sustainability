import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { Card } from '../Card/Card';
import styles from './SectionCard.module.css';

export interface SectionCardProps {
  id?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const SectionCard = ({
  id,
  title,
  description,
  icon,
  actions,
  children,
  className,
}: SectionCardProps) => {
  return (
    <Card id={id} className={cn(styles.section, className)} aria-labelledby={id && `${id}-title`}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h2 id={id && `${id}-title`} className={styles.title}>
            {icon && <span className={styles.icon}>{icon}</span>}
            {title}
          </h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </header>
      <div className={styles.body}>{children}</div>
    </Card>
  );
};
