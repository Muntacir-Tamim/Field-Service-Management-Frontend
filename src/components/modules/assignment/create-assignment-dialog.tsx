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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCreateAssignment } from "@/hooks";
import { getErrorMessage } from "@/utils";
import {
  createAssignmentSchema,
  MAX_VISIT_HOURS,
  parseLocalDateTime,
  toIsoString,
} from "@/validation";
import AvailableTechnicians from "./available-technicians";

interface CreateAssignmentDialogProps {
  serviceRequestId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ADMIN: APPROVED request এ সময় ঠিক করে free technician বসানো
export default function CreateAssignmentDialog({
  serviceRequestId,
  open,
  onOpenChange,
}: CreateAssignmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Assign a technician</DialogTitle>
          <DialogDescription>
            Choose the visit time first, then pick one of the technicians who
            are free in that slot (max {MAX_VISIT_HOURS} hours per visit).
          </DialogDescription>
        </DialogHeader>
        {/* dialog বন্ধ হলে content unmount হয়, তাই form state reset হয় */}
        <CreateForm
          serviceRequestId={serviceRequestId}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

// available technician এর query শুধু তখনই যায় যখন সময়ের window ঠিক
export function getValidWindow(start: string, end: string) {
  const s = parseLocalDateTime(start);
  const e = parseLocalDateTime(end);
  if (!s || !e || e <= s || s <= new Date()) {
    return null;
  }
  if ((e.getTime() - s.getTime()) / 3_600_000 > MAX_VISIT_HOURS) {
    return null;
  }
  return { scheduledStart: s.toISOString(), scheduledEnd: e.toISOString() };
}

// <input type="datetime-local" min=...> এর জন্য "এখন"
export function nowLocalValue() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function CreateForm({
  serviceRequestId,
  onClose,
}: {
  serviceRequestId: string;
  onClose: () => void;
}) {
  const { mutate: create, isPending } = useCreateAssignment();

  const form = useForm({
    defaultValues: {
      scheduledStart: "",
      scheduledEnd: "",
      technicianId: "",
      notes: "",
    },
    validators: { onSubmit: createAssignmentSchema },
    onSubmit: ({ value }) => {
      const notes = value.notes.trim();

      create(
        {
          serviceRequestId,
          technicianId: value.technicianId,
          scheduledStart: toIsoString(value.scheduledStart),
          scheduledEnd: toIsoString(value.scheduledEnd),
          ...(notes && { notes }),
        },
        {
          onSuccess: () => {
            toast.add({
              title: "Technician assigned",
              description: "They will be asked to confirm the visit",
              type: "success",
            });
            onClose();
          },
          onError: (err) => {
            toast.add({
              title: "Could not assign technician",
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
                  <FieldLabel htmlFor={field.name}>Visit starts</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="datetime-local"
                    min={nowLocalValue()}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      // সময় বদলালে আগের বাছাই করা technician আর ঠিক নাও থাকতে পারে
                      form.setFieldValue("technicianId", "");
                    }}
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
                  <FieldLabel htmlFor={field.name}>Visit ends</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="datetime-local"
                    min={start || nowLocalValue()}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      form.setFieldValue("technicianId", "");
                    }}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="technicianId">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel>Technician</FieldLabel>
                <AvailableTechnicians
                  scheduledStart={slot?.scheduledStart}
                  scheduledEnd={slot?.scheduledEnd}
                  selectedId={field.state.value}
                  onSelect={(id) => {
                    field.handleChange(id);
                    field.handleBlur();
                  }}
                  invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="notes">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Notes (optional)</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={3}
                  placeholder="Anything the technician should know"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                <FieldDescription>Up to 500 characters</FieldDescription>
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
                <Spinner /> Assigning
              </>
            ) : (
              "Assign technician"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
