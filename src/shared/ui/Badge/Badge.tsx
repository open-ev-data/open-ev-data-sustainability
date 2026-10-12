import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import styles from "./Badge.module.css";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "neutral";
}

export const Badge = ({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) => {
  return (
    <span className={cn(styles.badge, styles[variant], className)} {...props}>
      {children}
    </span>
  );
};
