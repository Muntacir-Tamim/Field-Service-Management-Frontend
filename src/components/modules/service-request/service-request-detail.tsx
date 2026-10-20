"use client";

import {
  CalendarClockIcon,
  FileIcon,
  MapPinIcon,
  StarIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import PageHeader from "@/components/common/page-header";
import StatusBadge from "@/components/common/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { canCancelServiceRequest } from "@/constants";
import { useGetServiceRequest } from "@/hooks";
import { CUSTOMER_ROUTES } from "@/routes";
import type { ServiceRequestAttachment, ServiceRequestDetail } from "@/types";
import { formatDate, formatDateTime, getErrorMessage } from "@/utils";
import CancelRequestDialog from "./cancel-request-dialog";

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

function Attachment({ file }: { file: ServiceRequestAttachment }) {
  const isImage = file.fileType.startsWith("image/");

  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 overflow-hidden rounded-lg border p-2 text-sm transition-colors hover:bg-muted/50"
    >
      {isImage ? (
        // biome-ignore lint/performance/noImgElement: Cloudinary URL, remote domain config লাগবে না
        <img
          src={file.url}
          alt={file.fileName ?? "Attachment"}
          className="size-12 shrink-0 rounded-md object-cover"
        />
      ) : (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <FileIcon className="size-5" aria-hidden="true" />
        </span>
      )}
      <span className="min-w-0 flex-1 truncate">
        {file.fileName ?? "Attachment"}
      </span>
    </a>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
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
                <Attachment key={file.id} file={file} />
              ))}
            </CardContent>
          ) : null}
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Technician &amp; schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {request.assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                A technician has not been assigned yet.
              </p>
            ) : (
              request.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="space-y-2 rounded-lg border p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex min-w-0 items-center gap-1.5 font-medium">
                      <UserIcon
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="truncate">
                        {assignment.technician.user.name}
                      </span>
                    </span>
                    <StatusBadge kind="assignment" value={assignment.status} />
                  </div>
                  <p className="inline-flex items-start gap-1.5 text-muted-foreground">
                    <CalendarClockIcon
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>
                      {formatDateTime(assignment.scheduledStart)}
                      <br />
                      to {formatDateTime(assignment.scheduledEnd)}
                    </span>
                  </p>
                  {assignment.workOrder ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Work order</span>
                      <StatusBadge
                        kind="workOrder"
                        value={assignment.workOrder.status}
                      />
                    </div>
                  ) : null}
                  {assignment.status === "CANCELLED" &&
                  assignment.cancelReason ? (
                    <p className="text-muted-foreground">
                      Reason: {assignment.cancelReason}
                    </p>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {request.feedback ? (
          <Card>
            <CardHeader>
              <CardTitle>Your feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="inline-flex items-center gap-1 font-medium">
                <StarIcon
                  className="size-4 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                {request.feedback.rating} / 5
              </p>
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

// /dashboard/service-requests/[id]
export default function ServiceRequestDetailView({ id }: { id: string }) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const { data, isPending, isError, error, refetch } = useGetServiceRequest(id);

  const request = data?.data;

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
        backHref={CUSTOMER_ROUTES.serviceRequests}
        backLabel="My requests"
        actions={
          request && canCancelServiceRequest(request.status) ? (
            <Button variant="destructive" onClick={() => setCancelOpen(true)}>
              <XCircleIcon />
              Cancel request
            </Button>
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

      <CancelRequestDialog
        request={cancelOpen && request ? request : null}
        onOpenChange={setCancelOpen}
      />
    </div>
  );
}
