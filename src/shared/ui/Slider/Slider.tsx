import { type ChangeEvent, forwardRef, type CSSProperties } from "react";
import { cn } from "../../lib/cn";
import styles from "./Slider.module.css";

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
  'aria-valuetext'?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      min = 0,
      max = 100,
      step = 1,
      value,
      onChange,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const percentage = ((value - min) / (max - min)) * 100;

    const style = {
      "--progress": `${percentage}%`,
    } as CSSProperties;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    };

    return (
      <div className={cn(styles.container, className)}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={styles.slider}
          style={style}
          {...props}
        />
      </div>
    );
  },
);

Slider.displayName = "Slider";
