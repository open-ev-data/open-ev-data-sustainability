import { useId, useState } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import styles from './InfoHint.module.css';

export interface InfoHintProps {
  text: string;
  label?: string;
  className?: string;
}

export const InfoHint = ({ text, label = 'More information', className }: InfoHintProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

  return (
    <span className={cn(styles.wrapper, className)}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={label}
        aria-expanded={isOpen}
        aria-describedby={isOpen ? id : undefined}
        onClick={() => setIsOpen((open) => !open)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={(event) => event.key === 'Escape' && setIsOpen(false)}
      >
        <Info size={14} />
      </button>
      {isOpen && (
        <span id={id} role="note" className={styles.bubble}>
          {text}
        </span>
      )}
    </span>
  );
};
