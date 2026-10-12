import { useId, useState, type ChangeEvent } from 'react';
import { cn } from '@/shared/lib/cn';
import { InfoHint } from '../InfoHint/InfoHint';
import styles from './NumberField.module.css';

export interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  error?: string;
  className?: string;
}

export const NumberField = ({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step = 1,
  hint,
  error,
  className,
}: NumberFieldProps) => {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    setDraft(raw);
    const parsed = Number(raw);
    if (raw.trim() !== '' && Number.isFinite(parsed)) {
      onChange(parsed);
    }
  };

  return (
    <div className={cn(styles.field, className)}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        {hint && <InfoHint text={hint} label={`About ${label}`} />}
      </div>
      <div className={cn(styles.control, error && styles.invalid)}>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          className={styles.input}
          value={draft ?? String(value)}
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
          onBlur={() => setDraft(null)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
};
