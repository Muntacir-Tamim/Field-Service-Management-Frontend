"use client";

import { useForm } from "@tanstack/react-form";
import { CalendarClockIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  canCancelAssignment,
  canConfirmAssignment,
  canRescheduleAssignment,
} from "@/constants";
import { useCancelAssignment, useConfirmAssignment } from "@/hooks";
import type { AssignmentWithRelations } from "@/types";
import { getErrorMessage } from "@/utils";
import { cancelAssignmentSchema } from "@/validation";
import RescheduleDialog from "./reschedule-dialog";

interface AssignmentActionsProps {
  assignment: AssignmentWithRelations;
  role: "ADMIN" | "TECHNICIAN";

  onRescheduled?: (next: AssignmentWithRelations) => void;
}

export default function AssignmentActions({
  assignment,
  role,
  onRescheduled,
}: AssignmentActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduling, setRescheduling] =
    useState<AssignmentWithRelations | null>(null);

  const { mutate: confirm, isPending: confirming } = useConfirmAssignment();

  const showConfirm = role === "TECHNICIAN" && canConfirmAssignment(assignment);
  const showReschedule =
    role === "ADMIN" && canRescheduleAssignment(assignment);
  const showCancel = canCancelAssignment(assignment);

  if (!showConfirm && !showReschedule && !showCancel) {
    return null;
  }

  const handleConfirm = () => {
    confirm(assignment.id, {
      onSuccess: () => {
        toast.add({
          title: "Assignment confirmed",
          description: "A work order has been created for this visit",
          type: "success",
        });
        setConfirmOpen(false);
      },
      onError: (err) => {
        toast.add({
          title: "Could not confirm",
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  return (
    <>
      {showConfirm ? (
        <Button onClick={() => setConfirmOpen(true)}>
          <CheckCircle2Icon />
          Confirm
        </Button>
      ) : null}
      {showReschedule ? (
        <Button variant="outline" onClick={() => setRescheduling(assignment)}>
          <CalendarClockIcon />
          Reschedule
        </Button>
      ) : null}
      {showCancel ? (
        <Button variant="destructive" onClick={() => setCancelOpen(true)}>
          <XCircleIcon />
          Cancel assignment
        </Button>
      ) : null}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm this visit?"
        description="You agree to visit the customer in the scheduled time slot. A work order will be created."
        confirmText="Confirm visit"
        isLoading={confirming}
        onConfirm={handleConfirm}
      />

      <CancelAssignmentDialog
        assignment={cancelOpen ? assignment : null}
        onOpenChange={setCancelOpen}
      />

      <RescheduleDialog
        assignment={rescheduling}
        onOpenChange={(open) => {
          if (!open) {
            setRescheduling(null);
          }
        }}
        onRescheduled={onRescheduled}
      />
    </>
  );
}

function CancelAssignmentDialog({
  assignment,
  onOpenChange,
}: {
  assignment: AssignmentWithRelations | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={Boolean(assignment)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel this assignment?</DialogTitle>
          <DialogDescription>
            The visit will be cancelled and the customer will be notified. This
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {assignment ? (
          <CancelForm
            assignmentId={assignment.id}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function CancelForm({
  assignmentId,
  onClose,
}: {
  assignmentId: string;
  onClose: () => void;
}) {
  const { mutate: cancel, isPending } = useCancelAssignment();

  const form = useForm({
    defaultValues: { reason: "" },
    validators: { onSubmit: cancelAssignmentSchema },
    onSubmit: ({ value }) => {
      cancel(
        { id: assignmentId, payload: { reason: value.reason.trim() } },
        {
          onSuccess: () => {
            toast.add({ title: "Assignment cancelled", type: "success" });
            onClose();
          },
          onError: (err) => {
            toast.add({
              title: "Could not cancel",
              description: getErrorMessage(err),
              type: "error",
            });
          },
        },
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
        <form.Field name="reason">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Reason</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={3}
                  placeholder="Why is this assignment being cancelled?"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
          >
            Keep assignment
          </Button>
          <Button type="submit" variant="destructive" disabled={isPending}>
            {isPending ? <Spinner /> : null}
            Cancel assignment
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
