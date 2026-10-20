"use client";

import { EyeIcon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/common/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { canCancelServiceRequest } from "@/constants";
import { cn } from "@/lib/utils";
import { CUSTOMER_ROUTES } from "@/routes";
import type { MyServiceRequest } from "@/types";
import { formatDate } from "@/utils";

const SKELETON_ROWS = ["a", "b", "c", "d", "e"];

interface ServiceRequestTableProps {
  requests: MyServiceRequest[];
  isLoading?: boolean;
  onCancel: (request: MyServiceRequest) => void;
}

export default function ServiceRequestTable({
  requests,
  isLoading = false,
  onCancel,
}: ServiceRequestTableProps) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Priority</TableHead>
            <TableHead className="hidden lg:table-cell">Technician</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? SKELETON_ROWS.map((id) => (
                <TableRow key={id}>
                  <TableCell>
                    <Skeleton className="h-4 w-44" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-7 w-16" />
                  </TableCell>
                </TableRow>
              ))
            : requests.map((request) => {
                const href = `${CUSTOMER_ROUTES.serviceRequests}/${request.id}`;
                const technician = request.assignments[0]?.technician.user.name;

                return (
                  <TableRow key={request.id}>
                    <TableCell className="max-w-64">
                      <Link
                        href={href}
                        className="block truncate font-medium underline-offset-4 hover:underline"
                      >
                        {request.title}
                      </Link>
                      <span className="block truncate text-xs text-muted-foreground">
                        {request.city}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        kind="serviceRequest"
                        value={request.status}
                      />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <StatusBadge kind="priority" value={request.priority} />
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      {technician ?? "—"}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {formatDate(request.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Link
                          href={href}
                          aria-label={`View ${request.title}`}
                          className={cn(
                            buttonVariants({
                              variant: "ghost",
                              size: "icon-sm",
                            }),
                          )}
                        >
                          <EyeIcon />
                        </Link>
                        {canCancelServiceRequest(request.status) ? (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Cancel ${request.title}`}
                            onClick={() => onCancel(request)}
                          >
                            <XCircleIcon className="text-destructive" />
                          </Button>
                        ) : null}
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
