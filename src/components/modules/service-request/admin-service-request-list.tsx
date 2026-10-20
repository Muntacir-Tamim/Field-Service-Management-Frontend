"use client";

import { ClipboardListIcon } from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import FilterBar from "@/components/common/filter-bar";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/ui/table-pagination";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  PRIORITY_OPTIONS,
  SERVICE_REQUEST_STATUS_OPTIONS,
} from "@/constants";
import { useGetAllServiceRequests } from "@/hooks";
import type { Priority, ServiceRequestStatus } from "@/types";
import { getErrorMessage } from "@/utils";
import AdminReviewSheet from "./admin-review-sheet";
import AdminServiceRequestTable from "./admin-service-request-table";

// /admin/service-requests এর পুরো UI: filter + table + pagination + review sheet
export default function AdminServiceRequestList() {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [status, setStatus] = useState<ServiceRequestStatus | "">("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [city, setCity] = useState("");
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const { data, isPending, isError, error, refetch } = useGetAllServiceRequests(
    { page, limit: DEFAULT_PAGE_SIZE, status, priority, city },
  );

  const requests = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const hasFilter = Boolean(status || priority || city);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Service requests"
        description="Review incoming requests, approve or reject them."
      />

      <FilterBar
        search={{
          value: city,
          onChange: (value) => {
            setCity(value);
            setPage(DEFAULT_PAGE);
          },
          placeholder: "Filter by city...",
        }}
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
          setCity("");
          setPage(DEFAULT_PAGE);
        }}
      />

      {isError ? (
        <EmptyState
          title="Could not load service requests"
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
              ? "Try different filters."
              : "New customer requests will show up here."
          }
        />
      ) : (
        <>
          <AdminServiceRequestTable
            requests={requests}
            isLoading={isPending}
            onReview={(request) => setReviewingId(request.id)}
          />
          <TablePagination
            page={page}
            totalPages={totalPages}
            handlePageChange={setPage}
          />
        </>
      )}

      <AdminReviewSheet
        requestId={reviewingId}
        onOpenChange={(open) => {
          if (!open) {
            setReviewingId(null);
          }
        }}
      />
    </div>
  );
}
