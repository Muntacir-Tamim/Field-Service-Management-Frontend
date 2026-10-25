"use client";

import { ScrollTextIcon } from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import FilterBar from "@/components/common/filter-bar";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TablePagination from "@/components/ui/table-pagination";
import {
  AUDIT_ACTION_OPTIONS,
  AUDIT_ENTITY_OPTIONS,
  DEFAULT_PAGE,
  USER_ROLE_OPTIONS,
} from "@/constants";
import { useGetAuditLogs, useUrlPage, useUrlState } from "@/hooks";
import type { AuditAction, UserRole } from "@/types";
import { getErrorMessage } from "@/utils";
import AuditLogDetailSheet from "./audit-log-detail-sheet";
import AuditLogTable from "./audit-log-table";

const PAGE_SIZE = 20;

function toIso(date: string, endOfDay: boolean) {
  if (!date) {
    return "";
  }
  return new Date(
    `${date}T${endOfDay ? "23:59:59.999" : "00:00:00"}`,
  ).toISOString();
}

export default function AuditLogList() {
  const [page, setPage] = useUrlPage(DEFAULT_PAGE);
  const [searchTerm, setSearchTerm] = useUrlState<string>("search", "");
  const [action, setAction] = useUrlState<AuditAction | "">("action", "");
  const [actorRole, setActorRole] = useUrlState<UserRole | "">("actorRole", "");
  const [entityType, setEntityType] = useUrlState<string>("entityType", "");
  const [from, setFrom] = useUrlState<string>("from", "");
  const [to, setTo] = useUrlState<string>("to", "");
  const [viewId, setViewId] = useState<string | null>(null);

  const { data, isPending, isError, error, refetch } = useGetAuditLogs({
    page,
    limit: PAGE_SIZE,
    searchTerm,
    action,
    actorRole,
    entityType,
    from: toIso(from, false),
    to: toIso(to, true),
  });

  const logs = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const hasFilter = Boolean(
    searchTerm || action || actorRole || entityType || from || to,
  );

  const reset = () => {
    setSearchTerm("");
    setAction("");
    setActorRole("");
    setEntityType("");
    setFrom("");
    setTo("");
    setPage(DEFAULT_PAGE);
  };

  const changeFilter =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(DEFAULT_PAGE);
    };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Audit logs"
        description="A record of important actions across the system."
      />

      <FilterBar
        search={{
          value: searchTerm,
          onChange: changeFilter(setSearchTerm),
          placeholder: "Search description or entity id",
        }}
        filters={[
          {
            key: "action",
            label: "Action",
            value: action,
            onChange: (value) =>
              changeFilter(setAction)(value as AuditAction | ""),
            options: AUDIT_ACTION_OPTIONS,
            allLabel: "All actions",
          },
          {
            key: "actorRole",
            label: "Actor role",
            value: actorRole,
            onChange: (value) =>
              changeFilter(setActorRole)(value as UserRole | ""),
            options: USER_ROLE_OPTIONS,
            allLabel: "All roles",
          },
          {
            key: "entityType",
            label: "Entity",
            value: entityType,
            onChange: changeFilter(setEntityType),
            options: AUDIT_ENTITY_OPTIONS,
            allLabel: "All entities",
          },
        ]}
        onReset={reset}
      >
        <Input
          type="date"
          aria-label="From date"
          value={from}
          max={to || undefined}
          onChange={(e) => changeFilter(setFrom)(e.target.value)}
          className="w-auto"
        />
        <Input
          type="date"
          aria-label="To date"
          value={to}
          min={from || undefined}
          onChange={(e) => changeFilter(setTo)(e.target.value)}
          className="w-auto"
        />
      </FilterBar>

      {isError ? (
        <EmptyState
          title="Could not load audit logs"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : !isPending && logs.length === 0 ? (
        <EmptyState
          icon={ScrollTextIcon}
          title={hasFilter ? "No logs match your filter" : "No activity yet"}
          description={
            hasFilter ? "Try a different filter or date range." : undefined
          }
        />
      ) : (
        <>
          <AuditLogTable
            logs={logs}
            isLoading={isPending}
            onView={(log) => setViewId(log.id)}
          />
          <TablePagination
            page={page}
            totalPages={totalPages}
            handlePageChange={setPage}
          />
        </>
      )}

      <AuditLogDetailSheet
        logId={viewId}
        onOpenChange={(open) => {
          if (!open) {
            setViewId(null);
          }
        }}
      />
    </div>
  );
}
