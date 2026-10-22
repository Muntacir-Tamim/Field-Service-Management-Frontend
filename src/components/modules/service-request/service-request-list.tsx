"use client";

import { ClipboardListIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import FilterBar from "@/components/common/filter-bar";
import PageHeader from "@/components/common/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import TablePagination from "@/components/ui/table-pagination";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  PRIORITY_OPTIONS,
  SERVICE_REQUEST_STATUS_OPTIONS,
} from "@/constants";
import { useGetMyServiceRequests } from "@/hooks";
import { cn } from "@/lib/utils";
import { CUSTOMER_ROUTES } from "@/routes";
import type { MyServiceRequest, Priority, ServiceRequestStatus } from "@/types";
import { getErrorMessage } from "@/utils";
import CancelRequestDialog from "./cancel-request-dialog";
import ServiceRequestTable from "./service-request-table";

function NewRequestLink({ className }: { className?: string }) {
  return (
    <Link
      href={CUSTOMER_ROUTES.newServiceRequest}
      className={cn(buttonVariants(), className)}
    >
      <PlusIcon />
      New request
    </Link>
  );
}

export default function ServiceRequestList() {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [status, setStatus] = useState<ServiceRequestStatus | "">("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [cancelling, setCancelling] = useState<MyServiceRequest | null>(null);

  const { data, isPending, isError, error, refetch } = useGetMyServiceRequests({
    page,
    limit: DEFAULT_PAGE_SIZE,
    status,
    priority,
  });

  const requests = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const hasFilter = Boolean(status || priority);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My service requests"
        description="Track the requests you have raised and their progress."
        actions={<NewRequestLink />}
      />

      <FilterBar
        filters={[
          {
            key: "status",
            label: "Status",
            value: status,
            onChange: (value) => {
              setStatus(value as ServiceRequestStatus | "");
              setPage(DEFAULT_PAGE);
            },
            options: SERVICE_REQUEST_STATUS_OPTIONS,
            allLabel: "All statuses",
          },
          {
            key: "priority",
            label: "Priority",
            value: priority,
            onChange: (value) => {
              setPriority(value as Priority | "");
              setPage(DEFAULT_PAGE);
            },
            options: PRIORITY_OPTIONS,
            allLabel: "All priorities",
          },
        ]}
        onReset={() => {
          setStatus("");
          setPriority("");
          setPage(DEFAULT_PAGE);
        }}
      />

      {isError ? (
        <EmptyState
          title="Could not load your requests"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : !isPending && requests.length === 0 ? (
        <EmptyState
          icon={ClipboardListIcon}
          title={
            hasFilter ? "No requests match your filters" : "No requests yet"
          }
          description={
            hasFilter
              ? "Try a different status or priority."
              : "Raise your first service request and we will take it from there."
          }
          action={hasFilter ? undefined : <NewRequestLink />}
        />
      ) : (
        <>
          <ServiceRequestTable
            requests={requests}
            isLoading={isPending}
            onCancel={setCancelling}
          />
          <TablePagination
            page={page}
            totalPages={totalPages}
            handlePageChange={setPage}
          />
        </>
      )}

      <CancelRequestDialog
        request={cancelling}
        onOpenChange={(open) => {
          if (!open) {
            setCancelling(null);
          }
        }}
      />
    </div>
  );
}
