import type { ReactNode } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import styles from './Notice.module.css';

export interface NoticeProps {
  tone?: 'info' | 'warning';
  children: ReactNode;
  className?: string;
}

export const Notice = ({ tone = 'info', children, className }: NoticeProps) => {
  const Icon = tone === 'warning' ? AlertTriangle : Info;

  return (
    <div className={cn(styles.notice, styles[tone], className)} role={tone === 'warning' ? 'alert' : 'note'}>
      <Icon size={18} className={styles.icon} aria-hidden="true" />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
