"use client";

import ConfirmDialog from "@/components/common/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { useVerifyWorkOrder } from "@/hooks";
import { getErrorMessage } from "@/utils";

interface VerifyWorkOrderDialogProps {
  workOrderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasServiceReport: boolean;
}

export default function VerifyWorkOrderDialog({
  workOrderId,
  open,
  onOpenChange,
  hasServiceReport,
}: VerifyWorkOrderDialogProps) {
  const { mutate: verify, isPending } = useVerifyWorkOrder();

  const handleConfirm = () => {
    verify(workOrderId, {
      onSuccess: () => {
        toast.add({ title: "Work order verified", type: "success" });
        onOpenChange(false);
      },
      onError: (err) => {
        toast.add({
          title: "Could not verify",
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Verify this work order?"
      description={
        hasServiceReport
          ? "Confirm the job is done properly. The customer will be notified and billed."
          : "The technician has not submitted a service report yet, so verification will fail until they do."
      }
      confirmText="Verify"
      isLoading={isPending}
      onConfirm={handleConfirm}
    />
  );
}
