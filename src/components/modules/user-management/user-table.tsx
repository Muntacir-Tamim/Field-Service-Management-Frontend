"use client";

import { BanIcon, CircleCheckIcon, Trash2Icon } from "lucide-react";
import StatusBadge from "@/components/common/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminUser } from "@/types";
import { formatDate, getInitials } from "@/utils";
import type { UserAction } from "./user-status-dialog";

const SKELETON_ROWS = ["a", "b", "c", "d", "e"];

interface UserTableProps {
  users: AdminUser[];
  isLoading?: boolean;

  currentUserId?: string;
  onAction: (user: AdminUser, action: UserAction) => void;
}

function canManage(user: AdminUser, currentUserId?: string) {
  return (
    user.role !== "ADMIN" &&
    user.id !== currentUserId &&
    user.status !== "DELETED"
  );
}

function UserDetails({ user }: { user: AdminUser }) {
  const profile = user.customer ?? user.technician;
  if (!profile) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <div className="space-y-1">
      <span className="block text-sm">{profile.contactNumber ?? "—"}</span>
      {user.customer?.city ? (
        <span className="block text-xs text-muted-foreground">
          {user.customer.city}
        </span>
      ) : null}
      {user.technician ? (
        <StatusBadge
          kind="technician"
          value={user.technician.verificationStatus}
        />
      ) : null}
    </div>
  );
}

export default function UserTable({
  users,
  isLoading = false,
  currentUserId,
  onAction,
}: UserTableProps) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Details</TableHead>
            <TableHead className="hidden md:table-cell">Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? SKELETON_ROWS.map((id) => (
                <TableRow key={id}>
                  <TableCell>
                    <Skeleton className="h-9 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-8 w-28" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-7 w-24" />
                  </TableCell>
                </TableRow>
              ))
            : users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {user.imageUrl ? (
                          <AvatarImage src={user.imageUrl} alt={user.name} />
                        ) : null}
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {user.name}
                          {user.id === currentUserId ? (
                            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                              (you)
                            </span>
                          ) : null}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge kind="role" value={user.role} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge kind="user" value={user.status} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <UserDetails user={user} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                      {canManage(user, currentUserId) ? (
                        <>
                          {user.status === "BLOCKED" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onAction(user, "unblock")}
                            >
                              <CircleCheckIcon />
                              Activate
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onAction(user, "block")}
                            >
                              <BanIcon />
                              Block
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            aria-label={`Delete ${user.name}`}
                            onClick={() => onAction(user, "delete")}
                          >
                            <Trash2Icon />
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
