"use client";

import { useForm, useStore } from "@tanstack/react-form";
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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useRescheduleAssignment } from "@/hooks";
import type { AssignmentWithRelations } from "@/types";
import { getErrorMessage, toDateTimeLocalValue } from "@/utils";
import {
  MAX_VISIT_HOURS,
  rescheduleAssignmentSchema,
  toIsoString,
} from "@/validation";
import AvailableTechnicians from "./available-technicians";
import { getValidWindow, nowLocalValue } from "./create-assignment-dialog";

interface RescheduleDialogProps {
  assignment: AssignmentWithRelations | null;
  onOpenChange: (open: boolean) => void;

  onRescheduled?: (next: AssignmentWithRelations) => void;
}

export default function RescheduleDialog({
  assignment,
  onOpenChange,
  onRescheduled,
}: RescheduleDialogProps) {
  return (
    <Dialog open={Boolean(assignment)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Reschedule visit</DialogTitle>
          <DialogDescription>
            The current assignment will be cancelled and a new one created for
            the new time. The technician has to confirm again.
          </DialogDescription>
        </DialogHeader>
        {assignment ? (
          <RescheduleForm
            assignment={assignment}
            onClose={() => onOpenChange(false)}
            onRescheduled={onRescheduled}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function RescheduleForm({
  assignment,
  onClose,
  onRescheduled,
}: {
  assignment: AssignmentWithRelations;
  onClose: () => void;
  onRescheduled?: (next: AssignmentWithRelations) => void;
}) {
  const { mutate: reschedule, isPending } = useRescheduleAssignment();

  const form = useForm({
    defaultValues: {
      scheduledStart: toDateTimeLocalValue(assignment.scheduledStart),
      scheduledEnd: toDateTimeLocalValue(assignment.scheduledEnd),

      technicianId: assignment.technicianId,
      reason: "",
      notes: "",
    },
    validators: { onSubmit: rescheduleAssignmentSchema },
    onSubmit: ({ value }) => {
      const reason = value.reason.trim();
      const notes = value.notes.trim();

      reschedule(
        {
          id: assignment.id,
          payload: {
            scheduledStart: toIsoString(value.scheduledStart),
            scheduledEnd: toIsoString(value.scheduledEnd),

            ...(value.technicianId &&
              value.technicianId !== assignment.technicianId && {
                technicianId: value.technicianId,
              }),
            ...(reason && { reason }),
            ...(notes && { notes }),
          },
        },
        {
          onSuccess: (res) => {
            toast.add({ title: "Visit rescheduled", type: "success" });
            onClose();
            onRescheduled?.((res as { data: AssignmentWithRelations }).data);
          },
          onError: (err) => {
            toast.add({
              title: "Could not reschedule",
              description: getErrorMessage(err),
              type: "error",
            });
          },
        },
      );
    },
  });

  const start = useStore(form.store, (state) => state.values.scheduledStart);
  const end = useStore(form.store, (state) => state.values.scheduledEnd);
  const slot = getValidWindow(start, end);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="scheduledStart">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>New start</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="datetime-local"
                    min={nowLocalValue()}
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

          <form.Field name="scheduledEnd">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>New end</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="datetime-local"
                    min={start || nowLocalValue()}
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
        </div>
        <p className="-mt-3 text-xs text-muted-foreground">
          A visit can be at most {MAX_VISIT_HOURS} hours long.
        </p>

        <form.Field name="technicianId">
          {(field) => (
            <Field>
              <FieldLabel>Technician</FieldLabel>
              <AvailableTechnicians
                scheduledStart={slot?.scheduledStart}
                scheduledEnd={slot?.scheduledEnd}
                selectedId={field.state.value}
                onSelect={field.handleChange}
                keepOption={{
                  id: assignment.technicianId,
                  label: `Keep ${assignment.technician.name}`,
                }}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="reason">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Reason (optional)</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={2}
                  placeholder="Why is the visit being rescheduled?"
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
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner /> Rescheduling
              </>
            ) : (
              "Reschedule"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
