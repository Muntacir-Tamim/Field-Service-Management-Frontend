"use client";

import { ExternalLinkIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/common/empty-state";
import InfoRow from "@/components/common/info-row";
import PageHeader from "@/components/common/page-header";
import StatusBadge from "@/components/common/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAssignment } from "@/hooks";
import { cn } from "@/lib/utils";
import { ADMIN_ROUTES, TECHNICIAN_ROUTES } from "@/routes";
import type { AssignmentWithRelations } from "@/types";
import {
  formatDate,
  formatDateTime,
  getErrorMessage,
  getInitials,
} from "@/utils";
import AssignmentActions from "./assignment-actions";

function DetailSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="h-72 w-full rounded-xl lg:col-span-2" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}

function AssignmentBody({
  assignment,
  mode,
}: {
  assignment: AssignmentWithRelations;
  mode: "admin" | "technician";
}) {
  const request = assignment.serviceRequest;
  const workOrderHref = assignment.workOrder
    ? `${mode === "admin" ? ADMIN_ROUTES.workOrders : TECHNICIAN_ROUTES.workOrders}/${assignment.workOrder.id}`
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        {assignment.status === "CANCELLED" ? (
          <Alert variant="destructive">
            <AlertTitle>Assignment cancelled</AlertTitle>
            <AlertDescription>
              {assignment.cancelReason ?? "No reason was provided."}
              {assignment.cancelledAt
                ? ` (${formatDateTime(assignment.cancelledAt)})`
                : ""}
            </AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Visit</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Scheduled start">
                {formatDateTime(assignment.scheduledStart)}
              </InfoRow>
              <InfoRow label="Scheduled end">
                {formatDateTime(assignment.scheduledEnd)}
              </InfoRow>
              <InfoRow label="Actual start">
                {formatDateTime(assignment.actualStart)}
              </InfoRow>
              <InfoRow label="Actual end">
                {formatDateTime(assignment.actualEnd)}
              </InfoRow>
              <InfoRow label="Confirmed">
                {assignment.confirmedAt
                  ? formatDateTime(assignment.confirmedAt)
                  : "Waiting for technician"}
              </InfoRow>
              <InfoRow label="Created">
                {formatDateTime(assignment.createdAt)}
              </InfoRow>
              <div className="sm:col-span-2">
                <InfoRow label="Notes">
                  <span className="whitespace-pre-wrap">
                    {assignment.notes ?? "—"}
                  </span>
                </InfoRow>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{request.title}</p>
              <div className="flex items-center gap-2">
                <StatusBadge kind="priority" value={request.priority} />
                <StatusBadge kind="serviceRequest" value={request.status} />
              </div>
            </div>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {request.description}
            </p>
            <dl className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Address">
                <span className="inline-flex items-start gap-1.5">
                  <MapPinIcon
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {request.address}, {request.city}
                </span>
              </InfoRow>
              <InfoRow label="Preferred date">
                {formatDate(request.preferredDate)}
              </InfoRow>
            </dl>
            {mode === "admin" ? (
              <Link
                href={`${ADMIN_ROUTES.serviceRequests}/${request.id}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                )}
              >
                <ExternalLinkIcon />
                Open service request
              </Link>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "admin" ? "Technician" : "Customer"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {mode === "admin" ? (
              <>
                <div className="flex items-center gap-3">
                  <Avatar>
                    {assignment.technician.user.imageUrl ? (
                      <AvatarImage
                        src={assignment.technician.user.imageUrl}
                        alt={assignment.technician.name}
                      />
                    ) : null}
                    <AvatarFallback>
                      {getInitials(assignment.technician.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <Link
                      href={`${ADMIN_ROUTES.technicians}/${assignment.technician.id}`}
                      className="block truncate font-medium hover:underline"
                    >
                      {assignment.technician.name}
                    </Link>
                    <span className="block truncate text-xs text-muted-foreground">
                      {assignment.technician.email}
                    </span>
                  </div>
                </div>
                <p className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <PhoneIcon className="size-4" aria-hidden="true" />
                  {assignment.technician.contactNumber ?? "—"}
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">{request.customer.name}</p>
                <p className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <PhoneIcon className="size-4" aria-hidden="true" />
                  {request.customer.contactNumber ?? "—"}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Work order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {assignment.workOrder && workOrderHref ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge
                    kind="workOrder"
                    value={assignment.workOrder.status}
                  />
                </div>
                <Link
                  href={workOrderHref}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-full",
                  )}
                >
                  Open work order
                </Link>
              </>
            ) : (
              <p className="text-muted-foreground">
                {assignment.status === "PENDING"
                  ? "A work order is created once the technician confirms."
                  : "No work order for this assignment."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// admin: /admin/assignments/[id], technician: /technician/assignments/[id]
export default function AssignmentDetail({
  id,
  mode,
}: {
  id: string;
  mode: "admin" | "technician";
}) {
  const router = useRouter();
  const { data, isPending, isError, error, refetch } = useGetAssignment(id);
  const assignment = data?.data;
  const listHref =
    mode === "admin" ? ADMIN_ROUTES.assignments : TECHNICIAN_ROUTES.assignments;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={assignment?.serviceRequest.title ?? "Assignment"}
        description={
          assignment ? (
            <span className="inline-flex flex-wrap items-center gap-2">
              <StatusBadge kind="assignment" value={assignment.status} />
              <span>{formatDateTime(assignment.scheduledStart)}</span>
            </span>
          ) : undefined
        }
        backHref={listHref}
        backLabel="Assignments"
        actions={
          assignment ? (
            <AssignmentActions
              assignment={assignment}
              role={mode === "admin" ? "ADMIN" : "TECHNICIAN"}
              onRescheduled={(next) => router.replace(`${listHref}/${next.id}`)}
            />
          ) : undefined
        }
      />

      {isPending ? (
        <DetailSkeleton />
      ) : isError || !assignment ? (
        <EmptyState
          title="Could not load this assignment"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : (
        <AssignmentBody assignment={assignment} mode={mode} />
      )}
    </div>
  );
}
