"use client";

import { CreditCardIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useInitiatePayment } from "@/hooks";
import type { PaymentStatus } from "@/types";
import { getErrorMessage } from "@/utils";

export function canPayInvoice(status: PaymentStatus) {
  return status === "UNPAID" || status === "FAILED" || status === "CANCELLED";
}

interface PayInvoiceButtonProps {
  invoiceId: string;
  status: PaymentStatus;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function PayInvoiceButton({
  invoiceId,
  status,
  size = "default",
  className,
}: PayInvoiceButtonProps) {
  const { mutate: initiate, isPending } = useInitiatePayment();

  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!canPayInvoice(status)) {
    return null;
  }

  const busy = isPending || isRedirecting;
  const label = isRedirecting
    ? "Redirecting to bKash"
    : isPending
      ? "Starting payment"
      : status === "UNPAID"
        ? "Pay with bKash"
        : "Try payment again";

  const handlePay = () => {
    initiate(invoiceId, {
      onSuccess: (res) => {
        const bkashUrl = res.data.bkashURL;
        if (!bkashUrl) {
          toast.add({
            title: "Could not start payment",
            description:
              "bKash did not return a payment link. Please try again.",
            type: "error",
          });
          return;
        }
        setIsRedirecting(true);
        window.location.assign(bkashUrl);
      },
      onError: (err) => {
        toast.add({
          title: "Could not start payment",
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  return (
    <Button
      size={size}
      className={className}
      disabled={busy}
      onClick={handlePay}
    >
      {busy ? <Spinner /> : <CreditCardIcon />}
      {label}
    </Button>
  );
}
