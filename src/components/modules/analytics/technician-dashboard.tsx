"use client";

import { CalendarClockIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import PageHeader from "@/components/common/page-header";
import StatusBadge from "@/components/common/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe, useGetMyAssignments, useGetMyStats } from "@/hooks";
import { cn } from "@/lib/utils";
import { TECHNICIAN_ROUTES } from "@/routes";
import { formatDateTime, getErrorMessage } from "@/utils";
import AvailabilityToggle from "../technician/availability-toggle";
import { RatingDistributionChart, StatusDonutChart } from "./charts";
import RangeFilter, { type RangePreset, rangeFromPreset } from "./range-filter";
import TechnicianStatsCards from "./technician-stats-cards";

function UpcomingVisits() {
  const [today] = useState(() => new Date().toISOString());
  const { data, isPending, isError, error } = useGetMyAssignments({
    page: 1,
    limit: 5,
    status: "CONFIRMED",
    from: today,
    sortBy: "scheduledStart",
    sortOrder: "asc",
  });
  const assignments = data?.data ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle>Upcoming visits</CardTitle>
          <CardDescription>Your next confirmed jobs.</CardDescription>
        </div>
        <Link
          href={TECHNICIAN_ROUTES.assignments}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-24 w-full rounded-lg" />
        ) : isError ? (
          <p className="text-sm text-muted-foreground">
            {getErrorMessage(error)}
          </p>
        ) : assignments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No upcoming visits. New assignments will show up here.
          </p>
        ) : (
          <ul className="divide-y">
            {assignments.map((assignment) => (
              <li key={assignment.id}>
                <Link
                  href={`${TECHNICIAN_ROUTES.assignments}/${assignment.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm hover:text-primary"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {assignment.serviceRequest.title}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarClockIcon
                        className="size-3.5"
                        aria-hidden="true"
                      />
                      {formatDateTime(assignment.scheduledStart)} ·{" "}
                      {assignment.serviceRequest.city}
                    </span>
                  </span>
                  <StatusBadge kind="assignment" value={assignment.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

// /technician
export default function TechnicianDashboard() {
  const [preset, setPreset] = useState<RangePreset>("");
  const { data: me } = useGetMe();
  const stats = useGetMyStats(rangeFromPreset(preset));
  const data = stats.data?.data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={me?.data?.name ? `Welcome back, ${me.data.name}` : "Dashboard"}
        description="Your jobs, hours and ratings."
      />

      <AvailabilityToggle />

      <RangeFilter value={preset} onChange={setPreset} />

      {stats.isError ? (
        <EmptyState
          title="Could not load your stats"
          description={getErrorMessage(stats.error)}
          action={
            <Button variant="outline" onClick={() => stats.refetch()}>
              Try again
            </Button>
          }
        />
      ) : (
        <>
          <TechnicianStatsCards stats={data} isLoading={stats.isPending} />

          <div className="grid gap-6 lg:grid-cols-2">
            <UpcomingVisits />
            <RatingDistributionChart
              distribution={data?.rating.distribution}
              isLoading={stats.isPending}
              description="How customers rated your work"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <StatusDonutChart
              kind="workOrder"
              title="Work orders"
              description="By status"
              counts={data?.workOrders.byStatus}
              centerLabel="orders"
              isLoading={stats.isPending}
            />
            <StatusDonutChart
              kind="assignment"
              title="Assignments"
              description="By status"
              counts={data?.assignments.byStatus}
              centerLabel="assignments"
              isLoading={stats.isPending}
            />
          </div>
        </>
      )}
    </div>
  );
}
