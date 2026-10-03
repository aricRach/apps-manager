"use client";

import {
  Area,
  AreaChart,
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

interface DataPoint {
  label: string;
  [key: string]: string | number;
}

interface AreaChartProps {
  data: DataPoint[];
  dataKeys: string[];
  xAxisKey?: string;
  height?: number;
}

export function AreaChartComponent({
  data,
  dataKeys,
  xAxisKey = "label",
  height = 256,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
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
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={chartColors[i]}
            fill={chartColors[i]}
            fillOpacity={0.1}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
