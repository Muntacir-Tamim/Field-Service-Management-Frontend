"use client";

import {
  CircleCheckIcon,
  CircleXIcon,
  type LucideIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CUSTOMER_ROUTES } from "@/routes";
import type { PaymentCallbackStatus } from "@/types";

interface BannerMeta {
  variant: "success" | "destructive" | "warning";
  icon: LucideIcon;
  title: string;
  description: string;
}

const BANNERS: Record<PaymentCallbackStatus, BannerMeta> = {
  success: {
    variant: "success",
    icon: CircleCheckIcon,
    title: "Payment successful",
    description:
      "Thank you! Your payment went through and the invoice is now marked as paid.",
  },
  failure: {
    variant: "destructive",
    icon: CircleXIcon,
    title: "Payment failed",
    description:
      "The payment could not be completed. You can try again from the invoice. If money was taken from your bKash account, please contact us with your invoice number.",
  },
  cancel: {
    variant: "warning",
    icon: TriangleAlertIcon,
    title: "Payment cancelled",
    description:
      "You cancelled the payment on bKash. You can pay any time from your unpaid invoice.",
  },
};

function isCallbackStatus(
  value: string | null,
): value is PaymentCallbackStatus {
  return value === "success" || value === "failure" || value === "cancel";
}

export default function PaymentResultBanner() {
  const router = useRouter();
  const status = useSearchParams().get("status");

  if (!isCallbackStatus(status)) {
    return null;
  }

  const { variant, icon: Icon, title, description } = BANNERS[status];

  const handleDismiss = () => {
    router.replace(CUSTOMER_ROUTES.payments, { scroll: false });
  };

  return (
    <Alert variant={variant}>
      <Icon aria-hidden="true" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      <AlertAction>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="Dismiss"
          onClick={handleDismiss}
        >
          <XIcon />
        </Button>
      </AlertAction>
    </Alert>
  );
}
