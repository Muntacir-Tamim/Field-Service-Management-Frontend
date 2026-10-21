"use client";

import { FileIcon, WrenchIcon } from "lucide-react";
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
import type { WorkOrderListItem } from "@/types";
import { formatDate, formatTime } from "@/utils";

const SKELETON_ROWS = ["a", "b", "c", "d", "e"];

export function getWorkOrderHref(mode: "admin" | "technician", id: string) {
  const base =
    mode === "admin" ? ADMIN_ROUTES.workOrders : TECHNICIAN_ROUTES.workOrders;
  return `${base}/${id}`;
}

interface WorkOrderTableProps {
  workOrders: WorkOrderListItem[];
  isLoading?: boolean;
  // admin এ technician column দেখায়, technician এ customer column
  mode: "admin" | "technician";
}

export default function WorkOrderTable({
  workOrders,
  isLoading = false,
  mode,
}: WorkOrderTableProps) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request</TableHead>
            <TableHead className="hidden md:table-cell">
              {mode === "admin" ? "Technician" : "Customer"}
            </TableHead>
            <TableHead>Visit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Details</TableHead>
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
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-7 w-16" />
                  </TableCell>
                </TableRow>
              ))
            : workOrders.map((order) => {
                const { assignment } = order;
                return (
                  <TableRow key={order.id}>
                    <TableCell className="max-w-64">
                      <Link
                        href={getWorkOrderHref(mode, order.id)}
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
                      <StatusBadge kind="workOrder" value={order.status} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="inline-flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <WrenchIcon className="size-3.5" aria-hidden="true" />
                          {order._count.parts} parts
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FileIcon className="size-3.5" aria-hidden="true" />
                          {order._count.attachments} files
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Link
                          href={getWorkOrderHref(mode, order.id)}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                          )}
                        >
                          View
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
}
