"use client";

import {
  CheckCircle2Icon,
  ClipboardListIcon,
  CreditCardIcon,
  HourglassIcon,
  PlusIcon,
  ThumbsUpIcon,
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/common/page-header";
import StatCard from "@/components/common/stat-card";
import StatusBadge from "@/components/common/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe, useGetMyInvoices, useGetMyServiceRequests } from "@/hooks";
import { cn } from "@/lib/utils";
import { CUSTOMER_ROUTES } from "@/routes";
import { formatCurrency, formatDate } from "@/utils";
import PayInvoiceButton from "../payment/pay-invoice-button";

function SectionCard({
  title,
  description,
  href,
  hrefLabel = "View all",
  children,
}: {
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </div>
        {href ? (
          <Link
            href={href}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            {hrefLabel}
          </Link>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// /dashboard (customer)। backend এ customer analytics endpoint নেই,
// তাই request আর invoice list থেকেই সংখ্যা (meta.total) বের করা হয়।
export default function CustomerDashboard() {
  const { data: me } = useGetMe();

  const all = useGetMyServiceRequests({ page: 1, limit: 5 });
  const pending = useGetMyServiceRequests({
    page: 1,
    limit: 1,
    status: "PENDING",
  });
  const approved = useGetMyServiceRequests({
    page: 1,
    limit: 1,
    status: "APPROVED",
  });
  const completed = useGetMyServiceRequests({
    page: 1,
    limit: 10,
    status: "COMPLETED",
  });
  const unpaid = useGetMyInvoices({ page: 1, limit: 5, status: "UNPAID" });

  const recent = all.data?.data ?? [];
  const unpaidInvoices = unpaid.data?.data ?? [];
  // শেষ হওয়া কিন্তু এখনো rating দেওয়া হয়নি
  const toRate = (completed.data?.data ?? []).filter((r) => !r.feedback);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={me?.data?.name ? `Hello, ${me.data.name}` : "Dashboard"}
        description="Track your service requests, payments and feedback."
        actions={
          <Link
            href={CUSTOMER_ROUTES.newServiceRequest}
            className={cn(buttonVariants())}
          >
            <PlusIcon />
            New request
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="All requests"
          icon={ClipboardListIcon}
          value={all.data?.meta?.total ?? 0}
          isLoading={all.isPending}
        />
        <StatCard
          title="Pending review"
          icon={HourglassIcon}
          value={pending.data?.meta?.total ?? 0}
          isLoading={pending.isPending}
        />
        <StatCard
          title="Approved"
          icon={CheckCircle2Icon}
          value={approved.data?.meta?.total ?? 0}
          isLoading={approved.isPending}
        />
        <StatCard
          title="Completed"
          icon={ThumbsUpIcon}
          value={completed.data?.meta?.total ?? 0}
          isLoading={completed.isPending}
        />
        <StatCard
          title="Unpaid invoices"
          icon={CreditCardIcon}
          value={unpaid.data?.meta?.total ?? 0}
          isLoading={unpaid.isPending}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Pay now"
          description="Invoices waiting for payment."
          href={CUSTOMER_ROUTES.payments}
        >
          {unpaid.isPending ? (
            <Skeleton className="h-20 w-full rounded-lg" />
          ) : unpaidInvoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing to pay right now.
            </p>
          ) : (
            <ul className="divide-y">
              {unpaidInvoices.map((invoice) => (
                <li
                  key={invoice.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                >
                  <Link
                    href={`${CUSTOMER_ROUTES.payments}/${invoice.id}`}
                    className="min-w-0 hover:underline"
                  >
                    <span className="block truncate font-medium">
                      {invoice.invoiceNumber}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(invoice.totalAmount)} · due{" "}
                      {formatDate(invoice.dueDate)}
                    </span>
                  </Link>
                  <PayInvoiceButton
                    invoiceId={invoice.id}
                    status={invoice.status}
                    size="sm"
                  />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Rate your service"
          description="Completed jobs without a review."
          href={CUSTOMER_ROUTES.feedbacks}
          hrefLabel="My feedbacks"
        >
          {completed.isPending ? (
            <Skeleton className="h-20 w-full rounded-lg" />
          ) : toRate.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You are all caught up.
            </p>
          ) : (
            <ul className="divide-y">
              {toRate.slice(0, 5).map((request) => (
                <li
                  key={request.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                >
                  <span className="min-w-0 truncate font-medium">
                    {request.title}
                  </span>
                  <Link
                    href={`${CUSTOMER_ROUTES.serviceRequests}/${request.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                    )}
                  >
                    Rate
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Recent requests"
        href={CUSTOMER_ROUTES.serviceRequests}
      >
        {all.isPending ? (
          <Skeleton className="h-28 w-full rounded-lg" />
        ) : recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You have not created a request yet.
          </p>
        ) : (
          <ul className="divide-y">
            {recent.map((request) => (
              <li key={request.id}>
                <Link
                  href={`${CUSTOMER_ROUTES.serviceRequests}/${request.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm hover:text-primary"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {request.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Submitted {formatDate(request.createdAt)}
                    </span>
                  </span>
                  <StatusBadge kind="serviceRequest" value={request.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
