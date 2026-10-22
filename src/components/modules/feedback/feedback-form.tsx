"use client";

import { useForm } from "@tanstack/react-form";
import { MessageSquareIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCreateFeedback, useUpdateFeedback } from "@/hooks";
import type { Feedback, ServiceRequestFeedback } from "@/types";
import { getErrorMessage } from "@/utils";
import { FEEDBACK_COMMENT_MAX, feedbackSchema } from "@/validation";
import { DeleteFeedbackDialog } from "./feedback-card";
import RatingStars from "./rating-stars";

// edit এর সময় যে দুটো field লাগে
type ExistingFeedback = Pick<
  Feedback | ServiceRequestFeedback,
  "id" | "rating" | "comment"
>;

interface FeedbackFormProps {
  serviceRequestId: string;

  feedback?: ExistingFeedback | null;

  onSaved?: () => void;
  onCancel?: () => void;
}

export default function FeedbackForm({
  serviceRequestId,
  feedback,
  onSaved,
  onCancel,
}: FeedbackFormProps) {
  const isEdit = Boolean(feedback);
  const { mutate: create, isPending: isCreating } = useCreateFeedback();
  const { mutate: update, isPending: isUpdating } = useUpdateFeedback();
  const isPending = isCreating || isUpdating;

  const handleSuccess = () => {
    toast.add({
      title: isEdit ? "Feedback updated" : "Thanks for your feedback!",
      type: "success",
    });
    onSaved?.();
  };

  const handleError = (err: unknown) => {
    toast.add({
      title: isEdit ? "Could not update feedback" : "Could not submit feedback",
      description: getErrorMessage(err),
      type: "error",
    });
  };

  const form = useForm({
    defaultValues: {
      rating: feedback?.rating ?? 0,
      comment: feedback?.comment ?? "",
    },
    validators: { onSubmit: feedbackSchema },
    onSubmit: ({ value }) => {
      const comment = value.comment.trim();

      if (feedback) {
        update(
          { id: feedback.id, payload: { rating: value.rating, comment } },
          { onSuccess: handleSuccess, onError: handleError },
        );
        return;
      }

      create(
        {
          serviceRequestId,
          rating: value.rating,
          ...(comment ? { comment } : {}),
        },
        { onSuccess: handleSuccess, onError: handleError },
      );
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="rating">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel>How was the service?</FieldLabel>
                <RatingStars
                  size="lg"
                  value={field.state.value}
                  disabled={isPending}
                  showValue
                  onChange={(next) => {
                    field.handleChange(next);
                    field.handleBlur();
                  }}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="comment">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Comment (optional)</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={4}
                  maxLength={FEEDBACK_COMMENT_MAX}
                  placeholder="Tell us about the technician and the work"
                  value={field.state.value}
                  disabled={isPending}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                <FieldDescription>
                  {field.state.value.length}/{FEEDBACK_COMMENT_MAX}
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="flex justify-end gap-2">
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onCancel}
            >
              Cancel
            </Button>
          ) : null}
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner /> Saving
              </>
            ) : isEdit ? (
              "Save changes"
            ) : (
              "Submit feedback"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

interface FeedbackEditDialogProps {
  feedback: (ExistingFeedback & { serviceRequestId: string }) | null;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackEditDialog({
  feedback,
  onOpenChange,
}: FeedbackEditDialogProps) {
  return (
    <Dialog open={Boolean(feedback)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit your feedback</DialogTitle>
          <DialogDescription>
            Change your rating or comment. The technician and admin will see the
            updated version.
          </DialogDescription>
        </DialogHeader>
        {feedback ? (
          <FeedbackForm
            serviceRequestId={feedback.serviceRequestId}
            feedback={feedback}
            onSaved={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

interface ServiceFeedbackPanelProps {
  serviceRequestId: string;

  isCompleted: boolean;
  feedback: ServiceRequestFeedback | null;
}

export function ServiceFeedbackPanel({
  serviceRequestId,
  isCompleted,
  feedback,
}: ServiceFeedbackPanelProps) {
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!feedback && !isCompleted) {
    return null;
  }

  if (!feedback) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <MessageSquareIcon className="size-4" aria-hidden="true" />
            Rate this service
          </CardTitle>
          <CardDescription>
            Your feedback helps us keep the quality high.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeedbackForm serviceRequestId={serviceRequestId} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {editing ? (
          <FeedbackForm
            serviceRequestId={serviceRequestId}
            feedback={feedback}
            onSaved={() => setEditing(false)}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <div className="space-y-2 text-sm">
              <RatingStars value={feedback.rating} showValue />
              {feedback.comment ? (
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {feedback.comment}
                </p>
              ) : (
                <p className="text-muted-foreground">No comment.</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <PencilIcon />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2Icon />
                Delete
              </Button>
            </div>
          </>
        )}
      </CardContent>
      <DeleteFeedbackDialog
        feedback={deleteOpen ? feedback : null}
        onOpenChange={setDeleteOpen}
        mode="customer"
      />
    </Card>
  );
}
