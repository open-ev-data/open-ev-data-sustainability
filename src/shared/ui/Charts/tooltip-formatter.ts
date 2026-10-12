export type ChartTooltipFormatter = (
  value: number | string | undefined,
  name?: string
) => [string, string];

/**
 * Adapts a simple formatter to the value shapes recharts may pass to a tooltip.
 */
export function toRechartsFormatter(formatter: ChartTooltipFormatter) {
  return (value: unknown, name: unknown): [string, string] =>
    formatter(
      Array.isArray(value) ? value.join(', ') : (value as number | string | undefined),
      name === undefined ? undefined : String(name)
    );
}
