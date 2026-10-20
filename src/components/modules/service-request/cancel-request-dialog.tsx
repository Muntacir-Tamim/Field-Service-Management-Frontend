"use client";

import ConfirmDialog from "@/components/common/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { useCancelServiceRequest } from "@/hooks";
import type { ServiceRequest } from "@/types";
import { getErrorMessage } from "@/utils";

interface CancelRequestDialogProps {
  // null হলে dialog বন্ধ
  request: Pick<ServiceRequest, "id" | "title"> | null;
  onOpenChange: (open: boolean) => void;
  // সফলভাবে cancel হলে (যেমন detail page এ কিছু করতে চাইলে)
  onCancelled?: () => void;
}

export default function CancelRequestDialog({
  request,
  onOpenChange,
  onCancelled,
}: CancelRequestDialogProps) {
  const { mutate: cancel, isPending } = useCancelServiceRequest();

  const handleConfirm = () => {
    if (!request) {
      return;
    }
    cancel(request.id, {
      onSuccess: () => {
        toast.add({
          title: "Request cancelled",
          description: `"${request.title}" has been cancelled`,
          type: "success",
        });
        onOpenChange(false);
        onCancelled?.();
      },
      onError: (err) => {
        toast.add({
          title: "Could not cancel request",
          description: getErrorMessage(err),
          type: "error",
        });
        onOpenChange(false);
      },
    });
  };

  return (
    <ConfirmDialog
      open={Boolean(request)}
      onOpenChange={onOpenChange}
      title="Cancel this request?"
      description={
        <>
          <strong>{request?.title}</strong> will be cancelled. This cannot be
          undone.
        </>
      }
      confirmText="Yes, cancel request"
      cancelText="Keep request"
      variant="destructive"
      isLoading={isPending}
      onConfirm={handleConfirm}
    />
  );
}
