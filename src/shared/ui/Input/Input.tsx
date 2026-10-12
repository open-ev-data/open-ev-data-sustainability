import { type InputHTMLAttributes, forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullRounded?: boolean; // For search bars
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, leadingIcon, trailingIcon, fullRounded = false, ...props },
    ref,
  ) => {
    return (
      <div className={styles.container}>
        {leadingIcon && <div className={styles.leadingIcon}>{leadingIcon}</div>}
        <input
          ref={ref}
          className={cn(
            styles.input,
            leadingIcon && styles.hasLeadingIcon,
            trailingIcon && styles.hasTrailingIcon,
            fullRounded && styles.roundedFull,
            className,
          )}
          {...props}
        />
        {trailingIcon && (
          <div className={styles.trailingIcon}>{trailingIcon}</div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
