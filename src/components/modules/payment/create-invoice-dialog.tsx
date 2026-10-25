"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
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
import { useCreateInvoice } from "@/hooks";
import { ADMIN_ROUTES } from "@/routes";
import type { CreateInvoicePayload, WorkOrderStatus } from "@/types";
import { getErrorMessage } from "@/utils";
import { createInvoiceSchema } from "@/validation";

export function canCreateInvoice(status: WorkOrderStatus, hasInvoice: boolean) {
  return status === "VERIFIED" && !hasInvoice;
}

interface CreateInvoiceDialogProps {
  workOrderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateInvoiceDialog({
  workOrderId,
  open,
  onOpenChange,
}: CreateInvoiceDialogProps) {
  const router = useRouter();
  const { mutate: create, isPending } = useCreateInvoice();

  const handleCreate = (payload: CreateInvoicePayload) => {
    create(payload, {
      onSuccess: (res) => {
        toast.add({
          title: "Invoice created",
          description: `${res.data.invoiceNumber} was sent to the customer.`,
          type: "success",
        });
        onOpenChange(false);
        router.push(`${ADMIN_ROUTES.invoices}/${res.data.id}`);
      },
      onError: (err) => {
        toast.add({
          title: "Could not create invoice",
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  const form = useForm({
    defaultValues: {
      workOrderId,
      discount: "",
      taxPercent: "",
      dueDate: "",
      notes: "",
    },
    validators: { onSubmit: createInvoiceSchema },
    onSubmit: ({ value }) => {
      const payload: CreateInvoicePayload = { workOrderId };
      if (value.discount !== "") payload.discount = Number(value.discount);
      if (value.taxPercent !== "")
        payload.taxPercent = Number(value.taxPercent);
      if (value.dueDate !== "") payload.dueDate = value.dueDate;
      if (value.notes.trim() !== "") payload.notes = value.notes.trim();
      handleCreate(payload);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create invoice</DialogTitle>
          <DialogDescription>
            Parts and labor are calculated from the work order. The customer is
            notified and can pay with bKash right after.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="discount">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Discount (৳)</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0"
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

            <form.Field name="taxPercent">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Tax (%)</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
                      max={100}
                      step="0.01"
                      placeholder="Default rate"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    <FieldDescription>
                      Leave empty to use the default tax rate.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="dueDate">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Due date</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="date"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="notes">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={3}
                      maxLength={500}
                      placeholder="Optional note for the customer"
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
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner /> Creating
                  </>
                ) : (
                  "Create invoice"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
