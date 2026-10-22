"use client";

import { useForm } from "@tanstack/react-form";
import {
  CheckCircle2Icon,
  EyeIcon,
  MapPinIcon,
  PhoneIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/confirm-dialog";
import StatusBadge from "@/components/common/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { canReviewServiceRequest } from "@/constants";
import {
  useGetServiceRequest,
  useMarkUnderReview,
  useReviewServiceRequest,
} from "@/hooks";
import type { ServiceRequestDetail } from "@/types";
import { formatDate, formatDateTime, getErrorMessage } from "@/utils";
import { rejectServiceRequestSchema } from "@/validation";
import RequestAttachment from "./request-attachment";

interface AdminReviewSheetProps {
  requestId: string | null;
  onOpenChange: (open: boolean) => void;
}

export default function AdminReviewSheet({
  requestId,
  onOpenChange,
}: AdminReviewSheetProps) {
  return (
    <Sheet open={Boolean(requestId)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {requestId ? <ReviewBody id={requestId} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function Row({
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

function ReviewBody({ id }: { id: string }) {
  const { data, isPending, isError, error, refetch } = useGetServiceRequest(id);
  const request = data?.data;

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <SheetHeader className="p-0">
          <SheetTitle>Review request</SheetTitle>
          <SheetDescription>Loading…</SheetDescription>
        </SheetHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <SheetHeader className="p-0">
          <SheetTitle>Review request</SheetTitle>
          <SheetDescription>{getErrorMessage(error)}</SheetDescription>
        </SheetHeader>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return <ReviewContent request={request} />;
}

function ReviewContent({ request }: { request: ServiceRequestDetail }) {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const { mutate: markUnderReview, isPending: isMarking } =
    useMarkUnderReview();
  const { mutate: review, isPending: isReviewing } = useReviewServiceRequest();

  const isReviewable = canReviewServiceRequest(request.status);
  const latestAssignment = request.assignments[0];

  const handleMarkUnderReview = () => {
    markUnderReview(request.id, {
      onSuccess: () => {
        toast.add({
          title: "Marked as under review",
          description: `"${request.title}" is now under review`,
          type: "success",
        });
      },
      onError: (err) => {
        toast.add({
          title: "Could not update request",
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  const handleApprove = () => {
    review(
      { id: request.id, payload: { status: "APPROVED" } },
      {
        onSuccess: () => {
          toast.add({
            title: "Request approved",
            description: "You can now assign a technician",
            type: "success",
          });
          setApproveOpen(false);
        },
        onError: (err) => {
          toast.add({
            title: "Could not approve request",
            description: getErrorMessage(err),
            type: "error",
          });
          setApproveOpen(false);
        },
      },
    );
  };

  const rejectForm = useForm({
    defaultValues: { rejectionReason: "" },
    validators: { onSubmit: rejectServiceRequestSchema },
    onSubmit: ({ value }) => {
      review(
        {
          id: request.id,
          payload: {
            status: "REJECTED",
            rejectionReason: value.rejectionReason.trim(),
          },
        },
        {
          onSuccess: () => {
            toast.add({
              title: "Request rejected",
              description: "The customer will be notified",
              type: "success",
            });
            setRejecting(false);
          },
          onError: (err) => {
            toast.add({
              title: "Could not reject request",
              description: getErrorMessage(err),
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <>
      <SheetHeader>
        <SheetTitle className="pr-8">{request.title}</SheetTitle>
        <SheetDescription className="flex flex-wrap items-center gap-2">
          <StatusBadge kind="serviceRequest" value={request.status} />
          <StatusBadge kind="priority" value={request.priority} />
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-1 flex-col gap-5 px-4">
        {request.status === "REJECTED" ? (
          <Alert variant="destructive">
            <XCircleIcon />
            <AlertTitle>Rejected</AlertTitle>
            <AlertDescription>
              {request.rejectionReason ?? "No reason was provided."}
            </AlertDescription>
          </Alert>
        ) : null}

        <section className="space-y-1">
          <h3 className="text-xs font-medium text-muted-foreground">
            Customer
          </h3>
          <p className="text-sm font-medium">{request.customer.user.name}</p>
          <p className="text-sm text-muted-foreground">
            {request.customer.user.email}
          </p>
          {request.customer.contactNumber ? (
            <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <PhoneIcon className="size-3.5" aria-hidden="true" />
              {request.customer.contactNumber}
            </p>
          ) : null}
        </section>

        <section className="space-y-1">
          <h3 className="text-xs font-medium text-muted-foreground">
            Description
          </h3>
          <p className="whitespace-pre-wrap text-sm">{request.description}</p>
        </section>

        <dl className="grid gap-4 sm:grid-cols-2">
          <Row label="Address">
            <span className="inline-flex items-start gap-1.5">
              <MapPinIcon
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              {request.address}, {request.city}
            </span>
          </Row>
          <Row label="Preferred date">{formatDate(request.preferredDate)}</Row>
          <Row label="Submitted">{formatDateTime(request.createdAt)}</Row>
          {request.reviewedAt ? (
            <Row label="Reviewed">
              {formatDateTime(request.reviewedAt)}
              {request.admin ? ` by ${request.admin.user.name}` : ""}
            </Row>
          ) : null}
          {latestAssignment ? (
            <Row label="Technician">
              {latestAssignment.technician.user.name}{" "}
              <StatusBadge kind="assignment" value={latestAssignment.status} />
            </Row>
          ) : null}
        </dl>

        {request.attachments.length > 0 ? (
          <section className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground">
              Attachments ({request.attachments.length})
            </h3>
            <div className="grid gap-2">
              {request.attachments.map((file) => (
                <RequestAttachment key={file.id} file={file} />
              ))}
            </div>
          </section>
        ) : null}

        {rejecting ? (
          <form
            className="rounded-lg border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              rejectForm.handleSubmit();
            }}
          >
            <FieldGroup>
              <rejectForm.Field name="rejectionReason">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Reason for rejection
                      </FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        rows={3}
                        autoFocus
                        placeholder="The customer will see this reason"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </rejectForm.Field>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isReviewing}
                  onClick={() => setRejecting(false)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isReviewing}
                >
                  {isReviewing ? <Spinner /> : null}
                  Confirm rejection
                </Button>
              </div>
            </FieldGroup>
          </form>
        ) : null}
      </div>

      {isReviewable && !rejecting ? (
        <div className="flex flex-wrap justify-end gap-2 border-t p-4">
          {request.status === "PENDING" ? (
            <Button
              variant="outline"
              disabled={isMarking}
              onClick={handleMarkUnderReview}
            >
              {isMarking ? <Spinner /> : <EyeIcon />}
              Mark under review
            </Button>
          ) : null}
          <Button variant="destructive" onClick={() => setRejecting(true)}>
            <XCircleIcon />
            Reject
          </Button>
          <Button onClick={() => setApproveOpen(true)}>
            <CheckCircle2Icon />
            Approve
          </Button>
        </div>
      ) : null}

      <ConfirmDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title="Approve this request?"
        description={
          <>
            <strong>{request.title}</strong> will be approved and become ready
            for technician assignment.
          </>
        }
        confirmText="Approve"
        isLoading={isReviewing}
        onConfirm={handleApprove}
      />
    </>
  );
}
