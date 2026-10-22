"use client";

import { useForm } from "@tanstack/react-form";
import {
  CheckCircle2Icon,
  MapPinIcon,
  NavigationIcon,
  PlayIcon,
} from "lucide-react";
import { useState } from "react";
import FileDropzone from "@/components/common/file-dropzone";
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
import { getNextWorkOrderAction } from "@/constants";
import {
  useCompleteWork,
  useMarkArrived,
  useMarkEnRoute,
  useStartWork,
} from "@/hooks";
import type { WorkOrderStatus } from "@/types";
import { getErrorMessage } from "@/utils";
import {
  completeWorkSchema,
  startWorkSchema,
  WORK_ORDER_FILE_MAX_MB,
} from "@/validation";

interface WorkOrderStatusActionsProps {
  workOrderId: string;
  status: WorkOrderStatus;
}

export default function WorkOrderStatusActions({
  workOrderId,
  status,
}: WorkOrderStatusActionsProps) {
  const [startOpen, setStartOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  const { mutate: enRoute, isPending: enRoutePending } = useMarkEnRoute();
  const { mutate: arrived, isPending: arrivedPending } = useMarkArrived();

  const action = getNextWorkOrderAction(status);
  if (!action) {
    return null;
  }

  const run = (
    mutate: typeof enRoute,
    successTitle: string,
    errorTitle: string,
  ) => {
    mutate(workOrderId, {
      onSuccess: () => toast.add({ title: successTitle, type: "success" }),
      onError: (err) =>
        toast.add({
          title: errorTitle,
          description: getErrorMessage(err),
          type: "error",
        }),
    });
  };

  return (
    <>
      {action === "EN_ROUTE" ? (
        <Button
          disabled={enRoutePending}
          onClick={() =>
            run(enRoute, "Marked as on the way", "Could not update status")
          }
        >
          {enRoutePending ? <Spinner /> : <NavigationIcon />}I am on my way
        </Button>
      ) : null}

      {action === "ARRIVED" ? (
        <Button
          disabled={arrivedPending}
          onClick={() =>
            run(arrived, "Marked as arrived", "Could not update status")
          }
        >
          {arrivedPending ? <Spinner /> : <MapPinIcon />}I have arrived
        </Button>
      ) : null}

      {action === "START" ? (
        <Button onClick={() => setStartOpen(true)}>
          <PlayIcon />
          Start work
        </Button>
      ) : null}

      {action === "COMPLETE" ? (
        <Button onClick={() => setCompleteOpen(true)}>
          <CheckCircle2Icon />
          Complete work
        </Button>
      ) : null}

      <Dialog open={startOpen} onOpenChange={setStartOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start work</DialogTitle>
            <DialogDescription>
              Describe what you found and what you are going to do.
            </DialogDescription>
          </DialogHeader>
          {startOpen ? (
            <StartForm
              workOrderId={workOrderId}
              onClose={() => setStartOpen(false)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete work</DialogTitle>
            <DialogDescription>
              Add your parts and service report before or right after this step.
              The admin can verify the job once the report is submitted.
            </DialogDescription>
          </DialogHeader>
          {completeOpen ? (
            <CompleteForm
              workOrderId={workOrderId}
              onClose={() => setCompleteOpen(false)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function StartForm({
  workOrderId,
  onClose,
}: {
  workOrderId: string;
  onClose: () => void;
}) {
  const { mutate: start, isPending } = useStartWork();

  const form = useForm({
    defaultValues: { problemFound: "", workDescription: "" },
    validators: { onSubmit: startWorkSchema },
    onSubmit: ({ value }) => {
      start(
        {
          id: workOrderId,
          payload: {
            problemFound: value.problemFound.trim(),
            workDescription: value.workDescription.trim(),
          },
        },
        {
          onSuccess: () => {
            toast.add({ title: "Work started", type: "success" });
            onClose();
          },
          onError: (err) => {
            toast.add({
              title: "Could not start work",
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
        <form.Field name="problemFound">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Problem found</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={3}
                  placeholder="What is wrong?"
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

        <form.Field name="workDescription">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Work to be done</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={4}
                  placeholder="Steps you will take to fix it"
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
                <Spinner /> Starting
              </>
            ) : (
              "Start work"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

function CompleteForm({
  workOrderId,
  onClose,
}: {
  workOrderId: string;
  onClose: () => void;
}) {
  const { mutate: complete, isPending } = useCompleteWork();

  const form = useForm({
    defaultValues: {
      laborHours: "",
      completionNotes: "",
      completionImage: [] as File[],
    },
    validators: { onSubmit: completeWorkSchema },
    onSubmit: ({ value }) => {
      complete(
        {
          id: workOrderId,
          payload: {
            laborHours: Number(value.laborHours),
            completionNotes: value.completionNotes.trim(),
            completionImage: value.completionImage[0] ?? null,
          },
        },
        {
          onSuccess: () => {
            toast.add({
              title: "Work completed",
              description: "Do not forget to submit the service report",
              type: "success",
            });
            onClose();
          },
          onError: (err) => {
            toast.add({
              title: "Could not complete work",
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
        <form.Field name="laborHours">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Labor hours</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  inputMode="decimal"
                  step="0.25"
                  min="0"
                  placeholder="e.g. 2.5"
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

        <form.Field name="completionNotes">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Completion notes</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={4}
                  placeholder="What was done and the final result"
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

        <form.Field name="completionImage">
          {(field) => (
            <Field>
              <FieldLabel>Completion photo (optional)</FieldLabel>
              <FileDropzone
                value={field.state.value}
                onChange={field.handleChange}
                accept="image/*"
                maxSizeMB={WORK_ORDER_FILE_MAX_MB}
                disabled={isPending}
                hint={`An image of the finished job, up to ${WORK_ORDER_FILE_MAX_MB} MB`}
              />
              <FieldDescription>
                Shown as proof of completion to the admin and customer.
              </FieldDescription>
            </Field>
          )}
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
                <Spinner /> Completing
              </>
            ) : (
              "Complete work"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
