"use client";

import { useForm } from "@tanstack/react-form";
import {
  CheckCircle2Icon,
  FileIcon,
  PhoneIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/confirm-dialog";
import InfoRow from "@/components/common/info-row";
import StatusBadge from "@/components/common/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { useGetTechnician, useReviewTechnician } from "@/hooks";
import type { Technician } from "@/types";
import {
  formatDate,
  formatDateTime,
  getErrorMessage,
  humanizeEnum,
} from "@/utils";
import { reviewTechnicianSchema } from "@/validation";

// backend: email verify হওয়া + PENDING (বা REJECTED হলে approve) অবস্থায় review হয়
export function canReviewTechnician(technician: Technician) {
  return (
    technician.user.emailVerified &&
    technician.verificationStatus !== "APPROVED"
  );
}

interface TechnicianReviewSheetProps {
  // null হলে sheet বন্ধ
  technicianId: string | null;
  onOpenChange: (open: boolean) => void;
}

// admin: আবেদন দেখে Approve / Reject
export default function TechnicianReviewSheet({
  technicianId,
  onOpenChange,
}: TechnicianReviewSheetProps) {
  return (
    <Sheet open={Boolean(technicianId)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {/* sheet বন্ধ হলে content unmount হয়, তাই reject form ও reset হয় */}
        {technicianId ? <ReviewBody id={technicianId} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function ReviewBody({ id }: { id: string }) {
  const { data, isPending, isError, error } = useGetTechnician(id);
  const technician = data?.data;

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !technician) {
    return (
      <div className="p-4">
        <SheetHeader className="p-0">
          <SheetTitle>Could not load application</SheetTitle>
          <SheetDescription>{getErrorMessage(error)}</SheetDescription>
        </SheetHeader>
      </div>
    );
  }

  return <ReviewContent technician={technician} />;
}

function ReviewContent({ technician }: { technician: Technician }) {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const { mutate: review, isPending } = useReviewTechnician();

  const canReview = canReviewTechnician(technician);

  const approve = () => {
    review(
      { id: technician.id, payload: { verificationStatus: "APPROVED" } },
      {
        onSuccess: () => {
          toast.add({ title: "Technician approved", type: "success" });
          setApproveOpen(false);
        },
        onError: (err) => {
          toast.add({
            title: "Could not approve",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      },
    );
  };

  const form = useForm({
    defaultValues: { rejectionReason: "" },
    validators: { onSubmit: reviewTechnicianSchema },
    onSubmit: ({ value }) => {
      review(
        {
          id: technician.id,
          payload: {
            verificationStatus: "REJECTED",
            rejectionReason: value.rejectionReason.trim(),
          },
        },
        {
          onSuccess: () => {
            toast.add({ title: "Application rejected", type: "success" });
            setRejecting(false);
            form.reset();
          },
          onError: (err) => {
            toast.add({
              title: "Could not reject",
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
        <SheetTitle>{technician.name}</SheetTitle>
        <SheetDescription className="flex flex-wrap items-center gap-2">
          <StatusBadge
            kind="technician"
            value={technician.verificationStatus}
          />
          <span>Applied {formatDate(technician.createdAt)}</span>
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-5 px-4 pb-4">
        {!technician.user.emailVerified ? (
          <Alert>
            <AlertTitle>Email not verified</AlertTitle>
            <AlertDescription>
              The applicant has not verified their email yet, so the application
              cannot be reviewed.
            </AlertDescription>
          </Alert>
        ) : null}

        {technician.verificationStatus === "REJECTED" ? (
          <Alert variant="destructive">
            <XCircleIcon />
            <AlertTitle>Application rejected</AlertTitle>
            <AlertDescription>
              {technician.rejectionReason ?? "No reason was provided."}
            </AlertDescription>
          </Alert>
        ) : null}

        <dl className="grid gap-4 sm:grid-cols-2">
          <InfoRow label="Email">{technician.email}</InfoRow>
          <InfoRow label="Phone">
            <span className="inline-flex items-center gap-1.5">
              <PhoneIcon
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              {technician.contactNumber ?? "—"}
            </span>
          </InfoRow>
          <InfoRow label="Experience">
            {technician.experienceYears} years
          </InfoRow>
          <InfoRow label="Gender">{humanizeEnum(technician.gender)}</InfoRow>
          <div className="sm:col-span-2">
            <InfoRow label="Address">{technician.address ?? "—"}</InfoRow>
          </div>
          <div className="sm:col-span-2">
            <InfoRow label="Bio">
              <span className="whitespace-pre-wrap">
                {technician.bio ?? "—"}
              </span>
            </InfoRow>
          </div>
        </dl>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Skills</p>
          <div className="flex flex-wrap gap-2">
            {technician.skills.map((entry) => (
              <Badge key={entry.skill.id} variant="outline">
                {entry.skill.name} · {humanizeEnum(entry.level)}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Documents</p>
          <TechnicianFiles technician={technician} />
        </div>

        {technician.reviewedAt ? (
          <p className="text-xs text-muted-foreground">
            Last reviewed {formatDateTime(technician.reviewedAt)}
          </p>
        ) : null}

        {canReview ? (
          rejecting ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.Field name="rejectionReason">
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
                          placeholder="The applicant will see this reason"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => setRejecting(false)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isPending}
                  >
                    {isPending ? <Spinner /> : <XCircleIcon />}
                    Confirm rejection
                  </Button>
                </div>
              </FieldGroup>
            </form>
          ) : (
            <div className="flex flex-wrap justify-end gap-2">
              {technician.verificationStatus === "PENDING" ? (
                <Button
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setRejecting(true)}
                >
                  <XCircleIcon />
                  Reject
                </Button>
              ) : null}
              <Button disabled={isPending} onClick={() => setApproveOpen(true)}>
                <CheckCircle2Icon />
                Approve
              </Button>
            </div>
          )
        ) : null}
      </div>

      <ConfirmDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title="Approve this technician?"
        description="They will be able to receive assignments right away, and we will email them the result."
        confirmText="Approve"
        isLoading={isPending}
        onConfirm={approve}
      />
    </>
  );
}

// resume + documents এর link (নতুন tab এ খোলে)
export function TechnicianFiles({ technician }: { technician: Technician }) {
  const files = [
    ...(technician.resumeUrl
      ? [{ url: technician.resumeUrl, name: "Resume / CV" }]
      : []),
    ...(technician.documents ?? []).map((file, index) => ({
      url: file.url,
      name: `Document ${index + 1}`,
    })),
  ];

  if (files.length === 0) {
    return <p className="text-sm text-muted-foreground">No files uploaded.</p>;
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {files.map((file) => (
        <li key={file.url}>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border p-2 text-sm transition-colors hover:bg-muted/50"
          >
            <FileIcon
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="truncate">{file.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
