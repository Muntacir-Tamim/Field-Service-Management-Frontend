import {
  CalendarClockIcon,
  CheckCircle2Icon,
  ClockIcon,
  StarIcon,
  XCircleIcon,
} from "lucide-react";
import StatCard from "@/components/common/stat-card";
import type { TechnicianStats } from "@/types";
import { formatNumber } from "@/utils";

interface TechnicianStatsCardsProps {
  stats?: TechnicianStats;
  isLoading?: boolean;
}

export default function TechnicianStatsCards({
  stats,
  isLoading,
}: TechnicianStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        title="Completed jobs"
        icon={CheckCircle2Icon}
        value={formatNumber(stats?.jobs.completed)}
        isLoading={isLoading}
      />
      <StatCard
        title="Labor hours"
        icon={ClockIcon}
        value={stats ? stats.laborHours.total.toFixed(1) : "—"}
        description={`${stats?.laborHours.averagePerJob ?? 0} h per job`}
        isLoading={isLoading}
      />
      <StatCard
        title="Average rating"
        icon={StarIcon}
        value={
          stats?.rating.average ? `${stats.rating.average.toFixed(1)} / 5` : "—"
        }
        description={`${stats?.rating.totalReviews ?? 0} reviews`}
        isLoading={isLoading}
      />
      <StatCard
        title="Upcoming visits"
        icon={CalendarClockIcon}
        value={formatNumber(stats?.assignments.upcomingVisits)}
        isLoading={isLoading}
      />
      <StatCard
        title="Cancellation rate"
        icon={XCircleIcon}
        value={stats ? `${stats.assignments.cancellationRate}%` : "—"}
        description={`of ${stats?.assignments.total ?? 0} assignments`}
        isLoading={isLoading}
      />
    </div>
  );
}
