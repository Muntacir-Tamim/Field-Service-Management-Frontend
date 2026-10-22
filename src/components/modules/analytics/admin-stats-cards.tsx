import {
  BanknoteIcon,
  ClipboardListIcon,
  HourglassIcon,
  StarIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/common/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ADMIN_ROUTES } from "@/routes";
import type { DashboardStats } from "@/types";
import { formatCurrency, formatNumber } from "@/utils";

interface AdminStatsCardsProps {
  stats?: DashboardStats;
  isLoading?: boolean;
}

// ADMIN home এর উপরের ৬টা সংখ্যা
export default function AdminStatsCards({
  stats,
  isLoading,
}: AdminStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        title="Service requests"
        icon={ClipboardListIcon}
        value={formatNumber(stats?.serviceRequests.total)}
        description={`${stats?.serviceRequests.byStatus.COMPLETED ?? 0} completed`}
        isLoading={isLoading}
      />
      <StatCard
        title="Revenue collected"
        icon={BanknoteIcon}
        value={formatCurrency(stats?.payments.amounts.collected)}
        description={`${formatCurrency(stats?.payments.amounts.refunded)} refunded`}
        isLoading={isLoading}
      />
      <StatCard
        title="Outstanding"
        icon={HourglassIcon}
        value={formatCurrency(stats?.payments.amounts.outstanding)}
        description={`${stats?.payments.byStatus.UNPAID ?? 0} unpaid invoices`}
        isLoading={isLoading}
      />
      <StatCard
        title="Technicians"
        icon={WrenchIcon}
        value={formatNumber(stats?.technicians.byVerification.APPROVED)}
        description={`${stats?.technicians.availableNow ?? 0} available now`}
        isLoading={isLoading}
      />
      <StatCard
        title="Customers"
        icon={UsersIcon}
        value={formatNumber(stats?.customers.total)}
        isLoading={isLoading}
      />
      <StatCard
        title="Average rating"
        icon={StarIcon}
        value={
          stats?.feedback.averageRating
            ? `${stats.feedback.averageRating.toFixed(1)} / 5`
            : "—"
        }
        description={`${stats?.feedback.totalReviews ?? 0} reviews`}
        isLoading={isLoading}
      />
    </div>
  );
}

// "এখনই দেখা দরকার" তালিকা; প্রতিটা সারি সংশ্লিষ্ট page এ নিয়ে যায়
export function AdminAttentionCard({ stats, isLoading }: AdminStatsCardsProps) {
  const needs = stats?.needsAttention;

  const items = [
    {
      label: "Pending service requests",
      value: needs?.pendingServiceRequests,
      href: ADMIN_ROUTES.serviceRequests,
    },
    {
      label: "Requests under review",
      value: needs?.underReviewServiceRequests,
      href: ADMIN_ROUTES.serviceRequests,
    },
    {
      label: "Approved, no technician yet",
      value: needs?.approvedWaitingForAssignment,
      href: ADMIN_ROUTES.assignments,
    },
    {
      label: "Work orders to verify",
      value: needs?.workOrdersAwaitingVerification,
      href: ADMIN_ROUTES.workOrders,
    },
    {
      label: "Unpaid invoices",
      value: needs?.unpaidInvoices,
      href: ADMIN_ROUTES.invoices,
    },
    {
      label: "Technician applications",
      value: needs?.pendingTechnicianApplications,
      href: ADMIN_ROUTES.technicians,
    },
    {
      label: "Visits scheduled today",
      value: needs?.visitsToday,
      href: ADMIN_ROUTES.assignments,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Needs attention</CardTitle>
        <CardDescription>
          Live counts, not affected by the period.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center justify-between gap-3 py-2.5 text-sm hover:text-primary"
              >
                <span>{item.label}</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <span
                    className={
                      item.value
                        ? "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 tabular-nums dark:bg-amber-500/20 dark:text-amber-300"
                        : "text-xs text-muted-foreground tabular-nums"
                    }
                  >
                    {item.value ?? 0}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
