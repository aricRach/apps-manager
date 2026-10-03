/*
Dashboard layout pattern: KPI cards → Charts (2:1 ratio) → Activity table.
This is a reference implementation — adapt imports and data for your app.
*/

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        actions={
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        }
      />

      <div className="space-y-6 px-6 pb-6">
        {/* KPI Cards: grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-4 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Revenue"
            value="$48,234.00"
            change={{ value: "+12.5%", trend: "up", label: "from last month" }}
          />
          {/* Add 2-3 more StatCards */}
        </div>

        {/* Charts: 2:1 ratio on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-md border border-border bg-bg-primary p-5 lg:col-span-2">
            <h3 className="text-sm font-medium text-fg-secondary">Revenue Over Time</h3>
            <div className="mt-4 h-64">
              {/* <AreaChartComponent data={data} dataKeys={["revenue"]} /> */}
            </div>
          </div>
          <div className="rounded-md border border-border bg-bg-primary p-5">
            <h3 className="text-sm font-medium text-fg-secondary">Revenue by Segment</h3>
            <div className="mt-4 h-64">
              {/* <DonutChartComponent data={segmentData} /> */}
            </div>
          </div>
        </div>

        {/* Recent Activity table */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-fg-secondary">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-accent">
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          {/* <DataTable columns={activityColumns} data={activityData} /> */}
        </div>
      </div>
    </>
  );
}
