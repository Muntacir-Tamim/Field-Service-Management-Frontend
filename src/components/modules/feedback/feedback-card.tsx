"use client";

import { PencilIcon, Trash2Icon, WrenchIcon } from "lucide-react";
import Link from "next/link";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useDeleteFeedback } from "@/hooks";
import { ADMIN_ROUTES, CUSTOMER_ROUTES } from "@/routes";
import type { Feedback } from "@/types";
import { formatDate, getErrorMessage, getInitials } from "@/utils";
import RatingStars from "./rating-stars";

export type FeedbackMode = "admin" | "customer" | "technician";

function wasEdited(feedback: Feedback) {
  return (
    new Date(feedback.updatedAt).getTime() -
      new Date(feedback.createdAt).getTime() >
    1000
  );
}

interface FeedbackCardProps {
  feedback: Feedback;
  mode: FeedbackMode;

  onEdit?: (feedback: Feedback) => void;

  onDelete?: (feedback: Feedback) => void;
}

export default function FeedbackCard({
  feedback,
  mode,
  onEdit,
  onDelete,
}: FeedbackCardProps) {
  const request = feedback.serviceRequest;
  const technician = request.assignments[0]?.technician;
  const requestHref =
    mode === "admin"
      ? `${ADMIN_ROUTES.serviceRequests}/${request.id}`
      : mode === "customer"
        ? `${CUSTOMER_ROUTES.serviceRequests}/${request.id}`
        : null;

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {mode === "customer" ? null : (
              <Avatar>
                <AvatarImage
                  src={feedback.customer.user.imageUrl}
                  alt={feedback.customer.name}
                />
                <AvatarFallback>
                  {getInitials(feedback.customer.name)}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {mode === "customer" ? request.title : feedback.customer.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(feedback.createdAt)}
                {wasEdited(feedback) ? " · edited" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <RatingStars value={feedback.rating} showValue />
          </div>
        </div>

        {feedback.comment ? (
          <p className="whitespace-pre-wrap text-sm">{feedback.comment}</p>
        ) : (
          <p className="text-sm text-muted-foreground">No comment left.</p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
            {mode === "customer" ? null : (
              <span className="min-w-0 truncate">
                {requestHref ? (
                  <Link href={requestHref} className="hover:underline">
                    {request.title}
                  </Link>
                ) : (
                  request.title
                )}
              </span>
            )}
            {mode === "technician" ? null : technician ? (
              <span className="inline-flex items-center gap-1">
                <WrenchIcon className="size-3.5" aria-hidden="true" />
                {technician.name}
              </span>
            ) : null}
            <span>{request.city}</span>
          </div>

          {onEdit || onDelete ? (
            <div className="flex items-center gap-1">
              {onEdit ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(feedback)}
                >
                  <PencilIcon />
                  Edit
                </Button>
              ) : null}
              {onDelete ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(feedback)}
                >
                  <Trash2Icon />
                  Delete
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

interface DeleteFeedbackDialogProps {
  feedback: Pick<Feedback, "id"> | null;
  onOpenChange: (open: boolean) => void;
  mode: Exclude<FeedbackMode, "technician">;
}

export function DeleteFeedbackDialog({
  feedback,
  onOpenChange,
  mode,
}: DeleteFeedbackDialogProps) {
  const { mutate: remove, isPending } = useDeleteFeedback();

  const handleDelete = () => {
    if (!feedback) {
      return;
    }
    remove(feedback.id, {
      onSuccess: () => {
        toast.add({ title: "Feedback deleted", type: "success" });
        onOpenChange(false);
      },
      onError: (err) => {
        toast.add({
          title: "Could not delete feedback",
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  return (
    <ConfirmDialog
      open={Boolean(feedback)}
      onOpenChange={onOpenChange}
      title="Delete this feedback?"
      description={
        mode === "admin"
          ? "The review will be removed from the customer, the technician and the rating analytics. This action is recorded in the audit log."
          : "Your review will be removed. You can submit a new one for this service afterwards."
      }
      confirmText="Delete"
      variant="destructive"
      isLoading={isPending}
      onConfirm={handleDelete}
    />
  );
}
