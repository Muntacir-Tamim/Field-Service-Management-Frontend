"use client";

import Link from "next/link";
import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import PageHeader from "@/components/common/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetDashboardStats, useGetTechnicianLeaderboard } from "@/hooks";
import { cn } from "@/lib/utils";
import { ADMIN_ROUTES } from "@/routes";
import { getErrorMessage } from "@/utils";
import AdminStatsCards, { AdminAttentionCard } from "./admin-stats-cards";
import { StatusBarChart, StatusDonutChart } from "./charts";
import RangeFilter, { type RangePreset, rangeFromPreset } from "./range-filter";
import TechnicianPerformanceTable from "./technician-performance-table";

// /admin
export default function AdminDashboard() {
  const [preset, setPreset] = useState<RangePreset>("30");
  const range = rangeFromPreset(preset);

  const stats = useGetDashboardStats(range);
  const leaderboard = useGetTechnicianLeaderboard({
    ...range,
    limit: 5,
    sortBy: "completedJobs",
  });

  const data = stats.data?.data;
  const isLoading = stats.isPending;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="How the business is doing at a glance."
      />

      <RangeFilter value={preset} onChange={setPreset} />

      {stats.isError ? (
        <EmptyState
          title="Could not load the dashboard"
          description={getErrorMessage(stats.error)}
          action={
            <Button variant="outline" onClick={() => stats.refetch()}>
              Try again
            </Button>
          }
        />
      ) : (
        <>
          <AdminStatsCards stats={data} isLoading={isLoading} />

          <div className="grid gap-6 lg:grid-cols-3">
            <StatusDonutChart
              className="lg:col-span-2"
              kind="serviceRequest"
              title="Service requests"
              description="By status"
              counts={data?.serviceRequests.byStatus}
              centerLabel="requests"
              isLoading={isLoading}
            />
            <AdminAttentionCard stats={data} isLoading={isLoading} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <StatusBarChart
              kind="workOrder"
              title="Work orders"
              description="By status"
              counts={data?.workOrders.byStatus}
              isLoading={isLoading}
            />
            <StatusDonutChart
              kind="payment"
              title="Invoices"
              description="By payment status"
              counts={data?.payments.byStatus}
              centerLabel="invoices"
              isLoading={isLoading}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <StatusDonutChart
              kind="assignment"
              title="Assignments"
              description="By status"
              counts={data?.assignments.byStatus}
              centerLabel="assignments"
              isLoading={isLoading}
            />
            <StatusDonutChart
              kind="technician"
              title="Technician applications"
              description="All time, by review status"
              counts={data?.technicians.byVerification}
              centerLabel="technicians"
              isLoading={isLoading}
            />
          </div>
        </>
      )}

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Top technicians</CardTitle>
            <CardDescription>
              Most completed jobs in this period.
            </CardDescription>
          </div>
          <Link
            href={ADMIN_ROUTES.technicianPerformance}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {leaderboard.isError ? (
            <p className="text-sm text-muted-foreground">
              {getErrorMessage(leaderboard.error)}
            </p>
          ) : !leaderboard.isPending &&
            (leaderboard.data?.data.data.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">
              No approved technicians yet.
            </p>
          ) : (
            <TechnicianPerformanceTable
              rows={leaderboard.data?.data.data ?? []}
              isLoading={leaderboard.isPending}
              sortBy="completedJobs"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
