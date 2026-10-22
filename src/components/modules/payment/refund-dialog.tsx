"use client";

import { useForm } from "@tanstack/react-form";
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
import { useRefundInvoice } from "@/hooks";
import type { Invoice, PaymentStatus } from "@/types";
import { formatCurrency, getErrorMessage } from "@/utils";
import { refundSchema } from "@/validation";

export function canRefundInvoice(status: PaymentStatus) {
  return status === "PAID";
}

interface RefundDialogProps {
  invoice: Pick<Invoice, "id" | "invoiceNumber" | "totalAmount"> | null;
  onOpenChange: (open: boolean) => void;

  onRefunded?: () => void;
}

export default function RefundDialog({
  invoice,
  onOpenChange,
  onRefunded,
}: RefundDialogProps) {
  const { mutate: refund, isPending } = useRefundInvoice();

  const handleRefund = (reason: string) => {
    if (!invoice) {
      return;
    }
    refund(
      { id: invoice.id, payload: { reason } },
      {
        onSuccess: () => {
          toast.add({
            title: "Refund issued",
            description: `${formatCurrency(invoice.totalAmount)} refunded for ${invoice.invoiceNumber}`,
            type: "success",
          });
          onOpenChange(false);
          onRefunded?.();
        },
        onError: (err) => {
          toast.add({
            title: "Could not refund",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <Dialog
      open={Boolean(invoice)}
      onOpenChange={(next) => {
        if (!isPending) {
          onOpenChange(next);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Refund this invoice?</DialogTitle>
          <DialogDescription>
            {invoice ? (
              <>
                The full amount of{" "}
                <strong>{formatCurrency(invoice.totalAmount)}</strong> for{" "}
                {invoice.invoiceNumber} will be returned to the customer&apos;s
                bKash account. This cannot be undone.
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        {invoice ? (
          <RefundForm
            isPending={isPending}
            onCancel={() => onOpenChange(false)}
            onSubmit={handleRefund}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function RefundForm({
  isPending,
  onCancel,
  onSubmit,
}: {
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (reason: string) => void;
}) {
  const form = useForm({
    defaultValues: { reason: "" },
    validators: { onSubmit: refundSchema },
    onSubmit: ({ value }) => onSubmit(value.reason.trim()),
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
                  maxLength={300}
                  placeholder="Why is this payment being refunded?"
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
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" variant="destructive" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner /> Refunding
              </>
            ) : (
              "Refund payment"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
