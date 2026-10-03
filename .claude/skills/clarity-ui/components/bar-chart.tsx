"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartColors = [
  "var(--chart-1, #2563eb)",
  "var(--chart-2, #d97706)",
  "var(--chart-3, #0d9488)",
  "var(--chart-4, #dc2626)",
  "var(--chart-5, #7c3aed)",
];

interface BarChartProps {
  data: Record<string, string | number>[];
  dataKeys: string[];
  xAxisKey?: string;
  height?: number;
  stacked?: boolean;
}

export function BarChartComponent({
  data,
  dataKeys,
  xAxisKey = "label",
  height = 256,
  stacked = false,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 12, fill: "var(--fg-muted)" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--fg-muted)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border-color)",
            borderRadius: "6px",
            fontSize: 12,
          }}
        />
        {dataKeys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            fill={chartColors[i]}
            radius={[4, 4, 0, 0]}
            stackId={stacked ? "stack" : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
