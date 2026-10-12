import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { toRechartsFormatter, type ChartTooltipFormatter } from './tooltip-formatter';

export interface BarChartProps {
  data: Record<string, unknown>[];
  xAxisKey: string;
  bars: {
    key: string;
    color?: string; // If not provided, can use cell colors
    name?: string;
  }[];
  height?: number;
  layout?: 'horizontal' | 'vertical';
  tooltipFormatter?: ChartTooltipFormatter;
  barColors?: string[]; // Cycle through these colors if provided
}

export const BarChart = ({
  data,
  xAxisKey,
  bars,
  height = 300,
  layout = 'horizontal',
  tooltipFormatter,
  barColors,
}: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        layout={layout}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border-subtle)"
          horizontal={layout === 'horizontal'}
          vertical={layout === 'vertical'}
        />
        {layout === 'horizontal' ? (
          <>
            <XAxis
              dataKey={xAxisKey}
              stroke="var(--text-secondary)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
          </>
        ) : (
          <>
            <XAxis
              type="number"
              stroke="var(--text-secondary)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              dataKey={xAxisKey}
              type="category"
              stroke="var(--text-secondary)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={100}
            />
          </>
        )}
        <Tooltip
          cursor={{ fill: 'var(--bg-surface-3)', opacity: 0.5 }}
          contentStyle={{
            backgroundColor: 'var(--bg-surface-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
          }}
          itemStyle={{ color: 'var(--text-primary)' }}
          {...(tooltipFormatter && { formatter: toRechartsFormatter(tooltipFormatter) })}
        />
        <LegendWrapper layout={layout} />
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            fill={bar.color || 'var(--color-primary)'}
            name={bar.name || bar.key}
            radius={layout === 'horizontal' ? [4, 4, 0, 0] : [0, 4, 4, 0]}
            barSize={32}
          >
            {barColors &&
              data.map((_entry, cellIndex) => (
                <Cell key={`cell-${cellIndex}`} fill={barColors[cellIndex % barColors.length]} />
              ))}
          </Bar>
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

const LegendWrapper = ({ layout }: { layout: 'horizontal' | 'vertical' }) => {
  if (layout === 'vertical') return null; // Often cleaner without legend for simple h-bars, or can enable
  return <Legend />;
};
