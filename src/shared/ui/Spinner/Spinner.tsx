import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import styles from "./Spinner.module.css";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const Spinner = ({ className, size = "md", ...props }: SpinnerProps) => {
  return (
    <div
      className={cn(styles.spinner, styles[size], className)}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
};
