"use client";

import { UsersIcon } from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import FilterBar from "@/components/common/filter-bar";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/ui/table-pagination";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from "@/constants";
import { useGetAdminUsers, useGetMe } from "@/hooks";
import type { UserRole, UserStatus } from "@/types";
import { getErrorMessage } from "@/utils";
import UserStatusDialog, { type UserActionTarget } from "./user-status-dialog";
import UserTable from "./user-table";

// /admin/users
export default function UserList() {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [target, setTarget] = useState<UserActionTarget | null>(null);

  const { data: me } = useGetMe();
  const { data, isPending, isError, error, refetch } = useGetAdminUsers({
    page,
    limit: DEFAULT_PAGE_SIZE,
    searchTerm,
    role,
    status,
  });

  const users = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const hasFilter = Boolean(searchTerm || role || status);

  const reset = () => {
    setSearchTerm("");
    setRole("");
    setStatus("");
    setPage(DEFAULT_PAGE);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users"
        description="Block, activate or remove customer and technician accounts."
      />

      <FilterBar
        search={{
          value: searchTerm,
          onChange: (value) => {
            setSearchTerm(value);
            setPage(DEFAULT_PAGE);
          },
          placeholder: "Search name, email or phone",
        }}
        filters={[
          {
            key: "role",
            label: "Role",
            value: role,
            onChange: (value) => {
              setRole(value as UserRole | "");
              setPage(DEFAULT_PAGE);
            },
            options: USER_ROLE_OPTIONS,
            allLabel: "All roles",
          },
          {
            key: "status",
            label: "Status",
            value: status,
            onChange: (value) => {
              setStatus(value as UserStatus | "");
              setPage(DEFAULT_PAGE);
            },
            options: USER_STATUS_OPTIONS,
            allLabel: "All (except deleted)",
          },
        ]}
        onReset={reset}
      />

      {isError ? (
        <EmptyState
          title="Could not load users"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : !isPending && users.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title={hasFilter ? "No users match your filter" : "No users yet"}
          description={
            hasFilter ? "Try a different search or filter." : undefined
          }
        />
      ) : (
        <>
          <UserTable
            users={users}
            isLoading={isPending}
            currentUserId={me?.data?.id}
            onAction={(user, action) => setTarget({ user, action })}
          />
          <TablePagination
            page={page}
            totalPages={totalPages}
            handlePageChange={setPage}
          />
        </>
      )}

      <UserStatusDialog
        target={target}
        onOpenChange={(open) => {
          if (!open) {
            setTarget(null);
          }
        }}
      />
    </div>
  );
}
