"use client";

import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import FilterBar from "@/components/common/filter-bar";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useGetTechnicianLeaderboard } from "@/hooks";
import type { LeaderboardSortBy } from "@/types";
import { getErrorMessage } from "@/utils";
import { ChartCard, SimpleBarChart } from "./charts";
import RangeFilter, { type RangePreset, rangeFromPreset } from "./range-filter";
import TechnicianPerformanceTable from "./technician-performance-table";

const SORT_OPTIONS = [
  { value: "completedJobs", label: "Completed jobs" },
  { value: "averageRating", label: "Average rating" },
  { value: "laborHours", label: "Labor hours" },
];

const CHART_COUNT = 10;

// /admin/technician-performance
export default function AdminPerformance() {
  const [preset, setPreset] = useState<RangePreset>("30");
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>("completedJobs");

  const { data, isPending, isError, error, refetch } =
    useGetTechnicianLeaderboard({
      ...rangeFromPreset(preset),
      sortBy,
      limit: 50,
    });

  const rows = data?.data.data ?? [];
  const chartData = rows.slice(0, CHART_COUNT).map((row) => ({
    name: row.name,
    value:
      sortBy === "averageRating"
        ? (row.averageRating ?? 0)
        : sortBy === "laborHours"
          ? row.laborHours
          : row.completedJobs,
  }));
  const chartTitle = SORT_OPTIONS.find((o) => o.value === sortBy)?.label;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Technician performance"
        description="Rank approved technicians by jobs, hours or customer rating."
      />

      <div className="flex flex-wrap items-center gap-2">
        <RangeFilter value={preset} onChange={setPreset} />
        <FilterBar
          filters={[
            {
              key: "sortBy",
              label: "Rank by",
              value: sortBy,
              onChange: (value) =>
                setSortBy((value || "completedJobs") as LeaderboardSortBy),
              options: SORT_OPTIONS,
              allLabel: "Completed jobs",
            },
          ]}
        />
      </div>

      {isError ? (
        <EmptyState
          title="Could not load the leaderboard"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : (
        <>
          <ChartCard
            title={`Top ${Math.min(rows.length, CHART_COUNT)} by ${chartTitle?.toLowerCase()}`}
            isLoading={isPending}
            isEmpty={
              chartData.length === 0 || chartData.every((d) => d.value === 0)
            }
          >
            <SimpleBarChart
              data={chartData}
              layout="horizontal"
              height={Math.max(160, chartData.length * 36)}
              unit={
                sortBy === "laborHours"
                  ? "h"
                  : sortBy === "averageRating"
                    ? "★"
                    : "jobs"
              }
            />
          </ChartCard>

          {!isPending && rows.length === 0 ? (
            <EmptyState
              title="No approved technicians yet"
              description="Approve a technician application to see them here."
            />
          ) : (
            <TechnicianPerformanceTable
              rows={rows}
              isLoading={isPending}
              sortBy={sortBy}
            />
          )}
        </>
      )}
    </div>
  );
}
