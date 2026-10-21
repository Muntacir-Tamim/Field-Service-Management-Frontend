"use client";

import { BellIcon, CheckCheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { getNotificationHref, NOTIFICATION_ROUTE_BY_ROLE } from "@/constants";
import {
  useGetNotifications,
  useGetUnreadCount,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from "@/hooks";
import { cn } from "@/lib/utils";
import type { Notification, UserRole } from "@/types";
import { getErrorMessage } from "@/utils";
import NotificationItem from "./notification-item";

const PREVIEW_LIMIT = 6;

// header এর ঘণ্টা: unread count badge + সাম্প্রতিক notification এর popover
export default function NotificationBell({ role }: { role: UserRole }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: countData } = useGetUnreadCount();
  const unreadCount = countData?.data.unreadCount ?? 0;

  // popover খুললেই শুধু list আনি
  const { data, isPending } = useGetNotifications(
    { page: 1, limit: PREVIEW_LIMIT },
    { enabled: open },
  );
  const notifications = data?.data ?? [];

  const { mutate: markRead } = useMarkNotificationAsRead();
  const { mutate: markAllRead, isPending: markingAll } =
    useMarkAllNotificationsAsRead();

  const handleOpen = (notification: Notification) => {
    if (!notification.isRead) {
      markRead(notification.id);
    }
    const href = getNotificationHref(notification, role);
    if (href) {
      setOpen(false);
      router.push(href);
    }
  };

  const handleMarkAll = () => {
    markAllRead(undefined, {
      onError: (err) => {
        toast.add({
          title: "Could not mark all as read",
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative",
        )}
      >
        <BellIcon />
        {unreadCount > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] leading-none font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 gap-0 p-0 sm:w-96">
        <div className="flex items-center justify-between gap-2 border-b px-3 py-2.5">
          <p className="font-heading text-sm font-medium">Notifications</p>
          <Button
            variant="ghost"
            size="sm"
            disabled={unreadCount === 0 || markingAll}
            onClick={handleMarkAll}
          >
            <CheckCheckIcon />
            Mark all read
          </Button>
        </div>

        <div className="max-h-96 divide-y overflow-y-auto">
          {isPending ? (
            <div className="flex flex-col gap-3 p-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              You are all caught up.
            </p>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onOpen={handleOpen}
                compact
              />
            ))
          )}
        </div>

        <div className="border-t p-2">
          <Link
            href={NOTIFICATION_ROUTE_BY_ROLE[role]}
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "w-full",
            )}
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
