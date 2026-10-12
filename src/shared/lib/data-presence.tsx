import type { ReactNode } from "react";

import { hasData } from "./has-data";

/**
 * Renders children only if value has data.
 * Passes the validated value to the render prop.
 *
 * Usage:
 * <DataField
 *   value={props.data}
 *   render={(val) => <span>{val}</span>}
 * />
 */
export interface DataFieldProps<T> {
  value: T | null | undefined;
  render: (data: T) => ReactNode;
  fallback?: ReactNode;
}

export function DataField<T>({
  value,
  render,
  fallback = null,
}: DataFieldProps<T>) {
  return hasData(value) ? <>{render(value)}</> : <>{fallback}</>;
}
