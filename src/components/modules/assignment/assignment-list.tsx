"use client";

import { CalendarClockIcon } from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import FilterBar from "@/components/common/filter-bar";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/ui/table-pagination";
import {
  ASSIGNMENT_STATUS_OPTIONS,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/constants";
import { useGetAssignments, useGetMyAssignments } from "@/hooks";
import type { AssignmentStatus } from "@/types";
import { getErrorMessage } from "@/utils";
import AssignmentTable from "./assignment-table";

export default function AssignmentList({
  mode,
}: {
  mode: "admin" | "technician";
}) {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [status, setStatus] = useState<AssignmentStatus | "">("");

  const params = { page, limit: DEFAULT_PAGE_SIZE, status };

  const adminQuery = useGetAssignments(params, { enabled: mode === "admin" });
  const myQuery = useGetMyAssignments(params, {
    enabled: mode === "technician",
  });
  const query = mode === "admin" ? adminQuery : myQuery;

  const { data, isPending, isError, error, refetch } = query;
  const assignments = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const hasFilter = Boolean(status);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={mode === "admin" ? "Assignments" : "My assignments"}
        description={
          mode === "admin"
            ? "Technician visits scheduled for approved requests."
            : "Visits assigned to you. Confirm a visit to start its work order."
        }
      />

      <FilterBar
        filters={[
          {
            key: "status",
            label: "Status",
            value: status,
            onChange: (value) => {
              setStatus(value as AssignmentStatus | "");
              setPage(DEFAULT_PAGE);
            },
            options: ASSIGNMENT_STATUS_OPTIONS,
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
          title="Could not load assignments"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : !isPending && assignments.length === 0 ? (
        <EmptyState
          icon={CalendarClockIcon}
          title={
            hasFilter
              ? "No assignments match your filter"
              : "No assignments yet"
          }
          description={
            hasFilter
              ? "Try a different status."
              : mode === "admin"
                ? "Assign a technician from an approved service request."
                : "You will see new visits here as soon as an admin assigns them."
          }
        />
      ) : (
        <>
          <AssignmentTable
            assignments={assignments}
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
