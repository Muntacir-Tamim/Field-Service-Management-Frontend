"use client";

import Link from "next/link";
import StatusBadge from "@/components/common/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ADMIN_ROUTES, TECHNICIAN_ROUTES } from "@/routes";
import type { AssignmentWithRelations } from "@/types";
import { formatDate, formatTime } from "@/utils";

const SKELETON_ROWS = ["a", "b", "c", "d", "e"];

interface AssignmentTableProps {
  assignments: AssignmentWithRelations[];
  isLoading?: boolean;
  // admin এ technician column দেখায়, technician এ customer column
  mode: "admin" | "technician";
}

export function getAssignmentHref(mode: "admin" | "technician", id: string) {
  const base =
    mode === "admin" ? ADMIN_ROUTES.assignments : TECHNICIAN_ROUTES.assignments;
  return `${base}/${id}`;
}

export default function AssignmentTable({
  assignments,
  isLoading = false,
  mode,
}: AssignmentTableProps) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request</TableHead>
            <TableHead className="hidden md:table-cell">
              {mode === "admin" ? "Technician" : "Customer"}
            </TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Work order</TableHead>
            <TableHead className="w-24 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? SKELETON_ROWS.map((id) => (
                <TableRow key={id}>
                  <TableCell>
                    <Skeleton className="h-4 w-44" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-7 w-16" />
                  </TableCell>
                </TableRow>
              ))
            : assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="max-w-64">
                    <Link
                      href={getAssignmentHref(mode, assignment.id)}
                      className="block truncate font-medium hover:underline"
                    >
                      {assignment.serviceRequest.title}
                    </Link>
                    <span className="block truncate text-xs text-muted-foreground">
                      {assignment.serviceRequest.city}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {mode === "admin"
                      ? assignment.technician.name
                      : assignment.serviceRequest.customer.name}
                  </TableCell>
                  <TableCell>
                    <span className="block">
                      {formatDate(assignment.scheduledStart)}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {formatTime(assignment.scheduledStart)} -{" "}
                      {formatTime(assignment.scheduledEnd)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge kind="assignment" value={assignment.status} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {assignment.workOrder ? (
                      <StatusBadge
                        kind="workOrder"
                        value={assignment.workOrder.status}
                      />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Link
                        href={getAssignmentHref(mode, assignment.id)}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                        )}
                      >
                        View
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
