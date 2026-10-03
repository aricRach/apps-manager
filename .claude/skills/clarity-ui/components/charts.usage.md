# Charts

Data visualization using Recharts. Three chart types: area/line, bar, donut.

## Chart selection guide

| Data type | Component | Example |
|-----------|-----------|---------|
| Trend over time | AreaChartComponent | Revenue, signups, page views |
| Category comparison | BarChartComponent | Revenue by product, users by plan |
| Proportional breakdown | DonutChartComponent | Revenue by segment, users by role |

## Chart container pattern

Every chart lives in a card wrapper:
```tsx
<div className="rounded-md border border-border bg-bg-primary p-5">
  <h3 className="text-sm font-medium text-fg-secondary">{title}</h3>
  <div className="mt-4 h-64">
    <AreaChartComponent data={data} dataKeys={["revenue"]} />
  </div>
</div>
```

## Rules

- Use chart colors from colors.json (8 colorblind-safe colors)
- Horizontal grid lines only, dashed, using --border color
- No axis lines, minimal ticks, muted color
- Area fill opacity: 0.1
- Bar radius: top corners only, 4px
- Default height: h-64 (256px), never taller than 320px in a dashboard
- Max 3 series per chart
- No 3D effects, no animations on load
