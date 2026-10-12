import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { toRechartsFormatter, type ChartTooltipFormatter } from './tooltip-formatter';

export interface LineChartProps {
  data: Record<string, unknown>[];
  xAxisKey: string;
  lines: {
    key: string;
    color: string;
    name?: string;
  }[];
  height?: number;
  yAxisLabel?: string;
  tooltipFormatter?: ChartTooltipFormatter;
}

export const LineChart = ({
  data,
  xAxisKey,
  lines,
  height = 300,
  yAxisLabel,
  tooltipFormatter,
}: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          stroke="var(--text-secondary)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="var(--text-secondary)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          label={
            yAxisLabel
              ? {
                  value: yAxisLabel,
                  angle: -90,
                  position: 'insideLeft',
                  fill: 'var(--text-secondary)',
                }
              : undefined
          }
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--bg-surface-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
          }}
          itemStyle={{ color: 'var(--text-primary)' }}
          {...(tooltipFormatter && { formatter: toRechartsFormatter(tooltipFormatter) })}
        />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            name={line.name || line.key}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
