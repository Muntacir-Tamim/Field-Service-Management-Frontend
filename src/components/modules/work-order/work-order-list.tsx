"use client";

import { FileTextIcon } from "lucide-react";
import EmptyState from "@/components/common/empty-state";
import FilterBar from "@/components/common/filter-bar";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/ui/table-pagination";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  WORK_ORDER_STATUS_OPTIONS,
} from "@/constants";
import {
  useGetMyWorkOrders,
  useGetWorkOrders,
  useUrlPage,
  useUrlState,
} from "@/hooks";
import type { WorkOrderStatus } from "@/types";
import { getErrorMessage } from "@/utils";
import WorkOrderTable from "./work-order-table";

export default function WorkOrderList({
  mode,
}: {
  mode: "admin" | "technician";
}) {
  const [page, setPage] = useUrlPage(DEFAULT_PAGE);
  const [status, setStatus] = useUrlState<WorkOrderStatus | "">("status", "");

  const params = { page, limit: DEFAULT_PAGE_SIZE, status };
  const adminQuery = useGetWorkOrders(params, { enabled: mode === "admin" });
  const myQuery = useGetMyWorkOrders(params, {
    enabled: mode === "technician",
  });
  const query = mode === "admin" ? adminQuery : myQuery;

  const { data, isPending, isError, error, refetch } = query;
  const workOrders = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const hasFilter = Boolean(status);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={mode === "admin" ? "Work orders" : "My work orders"}
        description={
          mode === "admin"
            ? "Track every job from visit to verification."
            : "Update the progress of your jobs and submit reports."
        }
      />

      <FilterBar
        filters={[
          {
            key: "status",
            label: "Status",
            value: status,
            onChange: (value) => {
              setStatus(value as WorkOrderStatus | "");
              setPage(DEFAULT_PAGE);
            },
            options: WORK_ORDER_STATUS_OPTIONS,
            allLabel: "All statuses",
          },
        ]}
        onReset={() => {
          setStatus("");
          setPage(DEFAULT_PAGE);
        }}
      />

      {isError ? (
        <EmptyState
          title="Could not load work orders"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : !isPending && workOrders.length === 0 ? (
        <EmptyState
          icon={FileTextIcon}
          title={
            hasFilter
              ? "No work orders match your filter"
              : "No work orders yet"
          }
          description={
            hasFilter
              ? "Try a different status."
              : "A work order is created when a technician confirms an assignment."
          }
        />
      ) : (
        <>
          <WorkOrderTable
            workOrders={workOrders}
            isLoading={isPending}
            mode={mode}
          />
          <TablePagination
            page={page}
            totalPages={totalPages}
            handlePageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
