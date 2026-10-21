"use client";

import { BellOffIcon, CheckCheckIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "@/components/common/confirm-dialog";
import EmptyState from "@/components/common/empty-state";
import FilterBar from "@/components/common/filter-bar";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TablePagination from "@/components/ui/table-pagination";
import { toast } from "@/components/ui/toast";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  getNotificationHref,
  NOTIFICATION_READ_OPTIONS,
  NOTIFICATION_TYPE_OPTIONS,
} from "@/constants";
import {
  useClearReadNotifications,
  useDeleteNotification,
  useGetMe,
  useGetNotifications,
  useGetUnreadCount,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from "@/hooks";
import type { Notification, NotificationType } from "@/types";
import { getErrorMessage } from "@/utils";
import NotificationItem from "./notification-item";

const SKELETON_ROWS = ["a", "b", "c", "d", "e"];

// তিন role এর notifications page এ এটাই বসে
export default function NotificationList() {
  const router = useRouter();
  const { data: me } = useGetMe();
  const role = me?.data.role;

  const [page, setPage] = useState(DEFAULT_PAGE);
  const [isRead, setIsRead] = useState<"true" | "false" | "">("");
  const [type, setType] = useState<NotificationType | "">("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isPending, isError, error, refetch } = useGetNotifications({
    page,
    limit: DEFAULT_PAGE_SIZE,
    isRead,
    type,
  });
  const { data: countData } = useGetUnreadCount();

  const { mutate: markRead } = useMarkNotificationAsRead();
  const { mutate: markAllRead, isPending: markingAll } =
    useMarkAllNotificationsAsRead();
  const { mutate: remove } = useDeleteNotification();
  const { mutate: clearRead, isPending: clearing } =
    useClearReadNotifications();

  const notifications = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const unreadCount = countData?.data.unreadCount ?? 0;
  const hasFilter = Boolean(isRead || type);

  const handleOpen = (notification: Notification) => {
    if (!notification.isRead) {
      markRead(notification.id);
    }
    const href = role ? getNotificationHref(notification, role) : null;
    if (href) {
      router.push(href);
    }
  };

  const handleDelete = (notification: Notification) => {
    setDeletingId(notification.id);
    remove(notification.id, {
      onError: (err) => {
        toast.add({
          title: "Could not delete notification",
          description: getErrorMessage(err),
          type: "error",
        });
      },
      onSettled: () => setDeletingId(null),
    });
  };

  const handleMarkAll = () => {
    markAllRead(undefined, {
      onSuccess: () => {
        toast.add({
          title: "All notifications marked as read",
          type: "success",
        });
      },
      onError: (err) => {
        toast.add({
          title: "Could not mark all as read",
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  const handleClearRead = () => {
    clearRead(undefined, {
      onSuccess: (res) => {
        const count = (res as { data?: { deletedCount?: number } }).data
          ?.deletedCount;
        toast.add({
          title: "Read notifications cleared",
          description:
            typeof count === "number" ? `${count} removed` : undefined,
          type: "success",
        });
        setConfirmClear(false);
        setPage(DEFAULT_PAGE);
      },
      onError: (err) => {
        toast.add({
          title: "Could not clear notifications",
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        description={
          unreadCount > 0
            ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`
            : "You are all caught up."
        }
        actions={
          <>
            <Button
              variant="outline"
              disabled={unreadCount === 0 || markingAll}
              onClick={handleMarkAll}
            >
              <CheckCheckIcon />
              Mark all as read
            </Button>
            <Button variant="outline" onClick={() => setConfirmClear(true)}>
              <Trash2Icon />
              Clear read
            </Button>
          </>
        }
      />

      <FilterBar
        filters={[
          {
            key: "isRead",
            label: "Status",
            value: isRead,
            onChange: (value) => {
              setIsRead(value as "true" | "false" | "");
              setPage(DEFAULT_PAGE);
            },
            options: NOTIFICATION_READ_OPTIONS,
            allLabel: "All notifications",
          },
          {
            key: "type",
            label: "Type",
            value: type,
            onChange: (value) => {
              setType(value as NotificationType | "");
              setPage(DEFAULT_PAGE);
            },
            options: NOTIFICATION_TYPE_OPTIONS,
            allLabel: "All types",
          },
        ]}
        onReset={() => {
          setIsRead("");
          setType("");
          setPage(DEFAULT_PAGE);
        }}
      />

      {isError ? (
        <EmptyState
          title="Could not load notifications"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : isPending ? (
        <div className="divide-y rounded-xl border">
          {SKELETON_ROWS.map((id) => (
            <div key={id} className="flex items-start gap-3 px-4 py-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-full max-w-md" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={BellOffIcon}
          title={
            hasFilter
              ? "No notifications match your filters"
              : "No notifications yet"
          }
          description={
            hasFilter
              ? "Try a different status or type."
              : "Updates about your requests, work and payments will show up here."
          }
        />
      ) : (
        <>
          <div className="divide-y overflow-hidden rounded-xl border">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onOpen={handleOpen}
                onDelete={handleDelete}
                isDeleting={deletingId === notification.id}
              />
            ))}
          </div>
          <TablePagination
            page={page}
            totalPages={totalPages}
            handlePageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Clear read notifications?"
        description="All notifications you have already read will be permanently deleted. Unread ones are kept."
        confirmText="Clear read"
        variant="destructive"
        isLoading={clearing}
        onConfirm={handleClearRead}
      />
    </div>
  );
}
