"use client";

import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useGetMyStats } from "@/hooks";
import { getErrorMessage } from "@/utils";
import {
  RatingDistributionChart,
  StatusBarChart,
  StatusDonutChart,
} from "./charts";
import RangeFilter, { type RangePreset, rangeFromPreset } from "./range-filter";
import TechnicianStatsCards from "./technician-stats-cards";

// /technician/performance
export default function TechnicianPerformance() {
  const [preset, setPreset] = useState<RangePreset>("30");
  const { data, isPending, isError, error, refetch } = useGetMyStats(
    rangeFromPreset(preset),
  );
  const stats = data?.data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My performance"
        description="Completed jobs, hours worked and what customers think."
      />

      <RangeFilter value={preset} onChange={setPreset} />

      {isError ? (
        <EmptyState
          title="Could not load your performance"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : (
        <>
          <TechnicianStatsCards stats={stats} isLoading={isPending} />

          <div className="grid gap-6 lg:grid-cols-2">
            <RatingDistributionChart
              distribution={stats?.rating.distribution}
              isLoading={isPending}
              description="Number of reviews per star"
            />
            <StatusBarChart
              kind="workOrder"
              title="Work orders"
              description="By status"
              counts={stats?.workOrders.byStatus}
              isLoading={isPending}
            />
          </div>

          <StatusDonutChart
            kind="assignment"
            title="Assignments"
            description="Confirmed vs cancelled"
            counts={stats?.assignments.byStatus}
            centerLabel="assignments"
            isLoading={isPending}
          />
        </>
      )}
    </div>
  );
}
