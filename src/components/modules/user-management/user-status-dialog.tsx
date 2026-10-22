"use client";

import { useForm } from "@tanstack/react-form";
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
import { useDeleteAdminUser, useUpdateAdminUserStatus } from "@/hooks";
import type { AdminUser } from "@/types";
import { getErrorMessage, humanizeEnum } from "@/utils";
import { blockUserSchema } from "@/validation";

export type UserAction = "block" | "unblock" | "delete";

export interface UserActionTarget {
  user: AdminUser;
  action: UserAction;
}

interface UserStatusDialogProps {
  target: UserActionTarget | null;
  onOpenChange: (open: boolean) => void;
}

export default function UserStatusDialog({
  target,
  onOpenChange,
}: UserStatusDialogProps) {
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateAdminUserStatus();
  const { mutate: remove, isPending: isDeleting } = useDeleteAdminUser();

  const user = target?.user ?? null;
  const action = target?.action ?? null;

  const handleError = (title: string) => (err: unknown) => {
    toast.add({ title, description: getErrorMessage(err), type: "error" });
  };

  const block = (reason: string) => {
    if (!user) {
      return;
    }
    updateStatus(
      { id: user.id, payload: { status: "BLOCKED", reason } },
      {
        onSuccess: () => {
          toast.add({
            title: "User blocked",
            description: `${user.name} can no longer sign in.`,
            type: "success",
          });
          onOpenChange(false);
        },
        onError: handleError("Could not block user"),
      },
    );
  };

  const unblock = () => {
    if (!user) {
      return;
    }
    updateStatus(
      { id: user.id, payload: { status: "ACTIVE" } },
      {
        onSuccess: () => {
          toast.add({ title: "User activated", type: "success" });
          onOpenChange(false);
        },
        onError: handleError("Could not activate user"),
      },
    );
  };

  const deleteUser = () => {
    if (!user) {
      return;
    }
    remove(user.id, {
      onSuccess: () => {
        toast.add({ title: "User deleted", type: "success" });
        onOpenChange(false);
      },
      onError: handleError("Could not delete user"),
    });
  };

  if (action === "block") {
    return (
      <Dialog
        open
        onOpenChange={(next) => {
          if (!isUpdating) {
            onOpenChange(next);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Block {user?.name}?</DialogTitle>
            <DialogDescription>
              They will not be able to sign in. A blocked technician is also
              marked unavailable so no new job is assigned.
            </DialogDescription>
          </DialogHeader>
          <BlockForm
            isPending={isUpdating}
            onCancel={() => onOpenChange(false)}
            onSubmit={block}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <ConfirmDialog
      open={Boolean(target)}
      onOpenChange={onOpenChange}
      title={
        action === "delete"
          ? `Delete ${user?.name}?`
          : `Activate ${user?.name}?`
      }
      description={
        action === "delete" ? (
          <>
            The {humanizeEnum(user?.role).toLowerCase()} account will be removed
            and can no longer sign in. This is blocked if they still have active
            requests or assignments.
          </>
        ) : (
          "They will be able to sign in again."
        )
      }
      confirmText={action === "delete" ? "Delete user" : "Activate"}
      variant={action === "delete" ? "destructive" : "default"}
      isLoading={isUpdating || isDeleting}
      onConfirm={action === "delete" ? deleteUser : unblock}
    />
  );
}

function BlockForm({
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
    validators: { onSubmit: blockUserSchema },
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
                  placeholder="Why is this account being blocked?"
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
                <Spinner /> Blocking
              </>
            ) : (
              "Block user"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
