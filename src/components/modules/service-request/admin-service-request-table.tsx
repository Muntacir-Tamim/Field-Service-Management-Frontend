"use client";

import { ClipboardCheckIcon } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/common/status-badge";
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
import { canReviewServiceRequest } from "@/constants";
import { ADMIN_ROUTES } from "@/routes";
import type { AdminServiceRequest } from "@/types";
import { formatDate } from "@/utils";

const SKELETON_ROWS = ["a", "b", "c", "d", "e"];

interface AdminServiceRequestTableProps {
  requests: AdminServiceRequest[];
  isLoading?: boolean;
  onReview: (request: AdminServiceRequest) => void;
}

export default function AdminServiceRequestTable({
  requests,
  isLoading = false,
  onReview,
}: AdminServiceRequestTableProps) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request</TableHead>
            <TableHead className="hidden md:table-cell">Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Priority</TableHead>
            <TableHead className="hidden lg:table-cell">Submitted</TableHead>
            <TableHead className="w-28 text-right">Action</TableHead>
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
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-7 w-20" />
                  </TableCell>
                </TableRow>
              ))
            : requests.map((request) => {
                // বাকি অবস্থায় শুধু দেখা যায়
                const needsReview = canReviewServiceRequest(request.status);

                return (
                  <TableRow key={request.id}>
                    <TableCell className="max-w-64">
                      <Link
                        href={`${ADMIN_ROUTES.serviceRequests}/${request.id}`}
                        className="block truncate font-medium hover:underline"
                      >
                        {request.title}
                      </Link>
                      <span className="block truncate text-xs text-muted-foreground">
                        {request.city}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="block">
                        {request.customer.user.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {request.customer.user.email}
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
                      {formatDate(request.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button
                          variant={needsReview ? "default" : "outline"}
                          size="sm"
                          onClick={() => onReview(request)}
                        >
                          {needsReview ? <ClipboardCheckIcon /> : null}
                          {needsReview ? "Review" : "View"}
                        </Button>
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
