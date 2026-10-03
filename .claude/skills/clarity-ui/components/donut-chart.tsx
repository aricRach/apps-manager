"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const chartColors = [
  "var(--chart-1, #2563eb)",
  "var(--chart-2, #d97706)",
  "var(--chart-3, #0d9488)",
  "var(--chart-4, #dc2626)",
  "var(--chart-5, #7c3aed)",
  "var(--chart-6, #0284c7)",
  "var(--chart-7, #b45309)",
  "var(--chart-8, #059669)",
];

interface DonutChartProps {
  data: { name: string; value: number }[];
  height?: number;
}

export function DonutChartComponent({ data, height = 256 }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="80%"
          paddingAngle={2}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={chartColors[i % chartColors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border-color)",
            borderRadius: "6px",
            fontSize: 12,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
