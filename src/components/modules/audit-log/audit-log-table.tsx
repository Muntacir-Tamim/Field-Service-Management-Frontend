"use client";

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
import type { AuditLog } from "@/types";
import { formatDateTime, humanizeEnum, truncate } from "@/utils";
import { AuditActionBadge } from "./audit-log-content";

const SKELETON_ROWS = ["a", "b", "c", "d", "e", "f"];

interface AuditLogTableProps {
  logs: AuditLog[];
  isLoading?: boolean;

  onView: (log: AuditLog) => void;
}

export default function AuditLogTable({
  logs,
  isLoading = false,
  onView,
}: AuditLogTableProps) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Action</TableHead>
            <TableHead className="hidden lg:table-cell">Description</TableHead>
            <TableHead className="hidden md:table-cell">By</TableHead>
            <TableHead className="hidden md:table-cell">Entity</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? SKELETON_ROWS.map((id) => (
                <TableRow key={id}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-64" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-7 w-14" />
                  </TableCell>
                </TableRow>
              ))
            : logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDateTime(log.createdAt)}
                  </TableCell>
                  <TableCell>
                    <AuditActionBadge action={log.action} />
                  </TableCell>
                  <TableCell className="hidden max-w-sm lg:table-cell">
                    <span className="block truncate text-muted-foreground">
                      {truncate(log.description, 90)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {log.actor ? (
                      <span className="block">
                        {log.actor.name}
                        <span className="block text-xs text-muted-foreground">
                          {humanizeEnum(log.actorRole)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">System</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {humanizeEnum(
                      log.entityType.replace(/([a-z])([A-Z])/g, "$1_$2"),
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(log)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
