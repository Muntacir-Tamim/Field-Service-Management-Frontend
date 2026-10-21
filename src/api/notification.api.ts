import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ClearReadResult,
  MarkAllReadResult,
  Notification,
  NotificationListParams,
  UnreadCount,
} from "@/types";
import { cleanParams } from "@/utils";

// সব role: নিজের notification (নতুন আগে, pagination সহ)
export function getMyNotifications(params?: NotificationListParams) {
  return apiClient<ApiResponse<Notification[]>>("/notifications", {
    query: cleanParams(params),
  });
}

export function getUnreadCount() {
  return apiClient<ApiResponse<UnreadCount>>("/notifications/unread-count");
}

export function markNotificationAsRead(notificationId: string) {
  return apiClient<ApiResponse<Notification>>(
    `/notifications/${notificationId}/read`,
    { method: "PATCH" },
  );
}

export function markAllNotificationsAsRead() {
  return apiClient<ApiResponse<MarkAllReadResult>>("/notifications/read-all", {
    method: "PATCH",
  });
}

export function deleteNotification(notificationId: string) {
  return apiClient<ApiResponse<{ deleted: boolean }>>(
    `/notifications/${notificationId}`,
    { method: "DELETE" },
  );
}

// সব পড়া notification মুছে ফেলে
export function clearReadNotifications() {
  return apiClient<ApiResponse<ClearReadResult>>("/notifications/clear-read", {
    method: "DELETE",
  });
}
