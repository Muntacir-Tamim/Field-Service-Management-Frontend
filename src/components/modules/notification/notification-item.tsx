"use client";

import { Trash2Icon } from "lucide-react";
import { getNotificationIcon } from "@/constants";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";
import { formatRelativeTime } from "@/utils";

interface NotificationItemProps {
  notification: Notification;
  onOpen: (notification: Notification) => void;

  onDelete?: (notification: Notification) => void;
  isDeleting?: boolean;

  compact?: boolean;
}

export default function NotificationItem({
  notification,
  onOpen,
  onDelete,
  isDeleting = false,
  compact = false,
}: NotificationItemProps) {
  const Icon = getNotificationIcon(notification.type);

  return (
    <div
      className={cn(
        "group/notification flex items-start gap-1 transition-colors hover:bg-muted/50",
        !notification.isRead && "bg-primary/5",
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(notification)}
        className={cn(
          "flex min-w-0 flex-1 items-start gap-3 text-left outline-none focus-visible:bg-muted",
          compact ? "px-3 py-2.5" : "px-4 py-3",
        )}
      >
        <span
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
            notification.isRead
              ? "bg-muted text-muted-foreground"
              : "bg-primary/10 text-primary",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "truncate text-sm",
                notification.isRead ? "font-normal" : "font-semibold",
              )}
            >
              {notification.title}
            </span>
            {!notification.isRead ? (
              <>
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full bg-primary"
                />
                <span className="sr-only">Unread</span>
              </>
            ) : null}
          </span>
          <span
            className={cn(
              "text-sm text-muted-foreground",
              compact ? "line-clamp-2" : "line-clamp-3",
            )}
          >
            {notification.message}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </span>
      </button>

      {onDelete ? (
        <button
          type="button"
          aria-label="Delete notification"
          disabled={isDeleting}
          onClick={() => onDelete(notification)}
          className="mt-3 mr-3 rounded-md p-1.5 text-muted-foreground outline-none hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
        >
          <Trash2Icon className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
