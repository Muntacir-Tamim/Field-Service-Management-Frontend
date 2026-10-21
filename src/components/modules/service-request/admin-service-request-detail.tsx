"use client";

import {
  CalendarClockIcon,
  ClipboardCheckIcon,
  EyeIcon,
  MapPinIcon,
  UserPlusIcon,
  XCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import InfoRow from "@/components/common/info-row";
import PageHeader from "@/components/common/page-header";
import StatusBadge from "@/components/common/status-badge";
import CreateAssignmentDialog from "@/components/modules/assignment/create-assignment-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { canReviewServiceRequest } from "@/constants";
import { useGetServiceRequest, useMarkUnderReview } from "@/hooks";
import { cn } from "@/lib/utils";
import { ADMIN_ROUTES } from "@/routes";
import type { ServiceRequestDetail } from "@/types";
import { formatDate, formatDateTime, getErrorMessage } from "@/utils";
import AdminReviewSheet from "./admin-review-sheet";
import RequestAttachment from "./request-attachment";

function DetailSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="h-72 w-full rounded-xl lg:col-span-2" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}

function hasActiveAssignment(request: ServiceRequestDetail) {
  return request.assignments.some(
    (a) => a.status === "PENDING" || a.status === "CONFIRMED",
  );
}

function RequestBody({ request }: { request: ServiceRequestDetail }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        {request.status === "REJECTED" ? (
          <Alert variant="destructive">
            <XCircleIcon />
            <AlertTitle>Request rejected</AlertTitle>
            <AlertDescription>
              {request.rejectionReason ?? "No reason was provided."}
            </AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="whitespace-pre-wrap text-sm">{request.description}</p>
            <dl className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Priority">
                <StatusBadge kind="priority" value={request.priority} />
              </InfoRow>
              <InfoRow label="Preferred date">
                {formatDate(request.preferredDate)}
              </InfoRow>
              <InfoRow label="Address">
                <span className="inline-flex items-start gap-1.5">
                  <MapPinIcon
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {request.address}, {request.city}
                </span>
              </InfoRow>
              <InfoRow label="Submitted">
                {formatDateTime(request.createdAt)}
              </InfoRow>
              {request.reviewedAt ? (
                <InfoRow label="Reviewed">
                  {formatDateTime(request.reviewedAt)}
                  {request.admin ? ` by ${request.admin.user.name}` : ""}
                </InfoRow>
              ) : null}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
            <CardDescription>
              {request.attachments.length === 0
                ? "No files were attached."
                : `${request.attachments.length} file(s)`}
            </CardDescription>
          </CardHeader>
          {request.attachments.length > 0 ? (
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {request.attachments.map((file) => (
                <RequestAttachment key={file.id} file={file} />
              ))}
            </CardContent>
          ) : null}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
            <CardDescription>
              Every visit scheduled for this request, newest first.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {request.assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No technician has been assigned yet.
              </p>
            ) : (
              request.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="space-y-2 rounded-lg border p-3 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">
                      {assignment.technician.user.name}
                    </span>
                    <StatusBadge kind="assignment" value={assignment.status} />
                  </div>
                  <p className="inline-flex items-start gap-1.5 text-muted-foreground">
                    <CalendarClockIcon
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>
                      {formatDateTime(assignment.scheduledStart)} to{" "}
                      {formatDateTime(assignment.scheduledEnd)}
                    </span>
                  </p>
                  {assignment.status === "CANCELLED" &&
                  assignment.cancelReason ? (
                    <p className="text-muted-foreground">
                      Reason: {assignment.cancelReason}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`${ADMIN_ROUTES.assignments}/${assignment.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                      )}
                    >
                      Open assignment
                    </Link>
                    {assignment.workOrder ? (
                      <>
                        <Link
                          href={`${ADMIN_ROUTES.workOrders}/${assignment.workOrder.id}`}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                          )}
                        >
                          Open work order
                        </Link>
                        <StatusBadge
                          kind="workOrder"
                          value={assignment.workOrder.status}
                        />
                      </>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoRow label="Name">{request.customer.user.name}</InfoRow>
            <InfoRow label="Email">{request.customer.user.email}</InfoRow>
            <InfoRow label="Phone">
              {request.customer.contactNumber ?? "—"}
            </InfoRow>
          </CardContent>
        </Card>

        {request.feedback ? (
          <Card>
            <CardHeader>
              <CardTitle>Customer feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{request.feedback.rating} / 5</p>
              {request.feedback.comment ? (
                <p className="text-muted-foreground">
                  {request.feedback.comment}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

// /admin/service-requests/[id]
export default function AdminServiceRequestDetail({ id }: { id: string }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const { data, isPending, isError, error, refetch } = useGetServiceRequest(id);
  const { mutate: markUnderReview, isPending: marking } = useMarkUnderReview();

  const request = data?.data;
  const canReview = request ? canReviewServiceRequest(request.status) : false;
  const canAssign =
    request?.status === "APPROVED" && !hasActiveAssignment(request);

  const handleUnderReview = () => {
    markUnderReview(id, {
      onSuccess: () =>
        toast.add({ title: "Marked as under review", type: "success" }),
      onError: (err) =>
        toast.add({
          title: "Could not update request",
          description: getErrorMessage(err),
          type: "error",
        }),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={request?.title ?? "Service request"}
        description={
          request ? (
            <span className="inline-flex flex-wrap items-center gap-2">
              <StatusBadge kind="serviceRequest" value={request.status} />
              <span>Submitted {formatDate(request.createdAt)}</span>
            </span>
          ) : undefined
        }
        backHref={ADMIN_ROUTES.serviceRequests}
        backLabel="Service requests"
        actions={
          request ? (
            <>
              {request.status === "PENDING" ? (
                <Button
                  variant="outline"
                  disabled={marking}
                  onClick={handleUnderReview}
                >
                  {marking ? <Spinner /> : <EyeIcon />}
                  Mark under review
                </Button>
              ) : null}
              {canReview ? (
                <Button onClick={() => setReviewOpen(true)}>
                  <ClipboardCheckIcon />
                  Review request
                </Button>
              ) : null}
              {canAssign ? (
                <Button onClick={() => setAssignOpen(true)}>
                  <UserPlusIcon />
                  Assign technician
                </Button>
              ) : null}
            </>
          ) : undefined
        }
      />

      {isPending ? (
        <DetailSkeleton />
      ) : isError || !request ? (
        <EmptyState
          title="Could not load this request"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : (
        <RequestBody request={request} />
      )}

      <AdminReviewSheet
        requestId={reviewOpen ? id : null}
        onOpenChange={setReviewOpen}
      />
      <CreateAssignmentDialog
        serviceRequestId={id}
        open={assignOpen}
        onOpenChange={setAssignOpen}
      />
    </div>
  );
}
