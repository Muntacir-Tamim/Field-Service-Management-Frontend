import type { NotificationType } from "./enum.type";

// Backend `Notification` model (GET /notifications এর প্রতিটা item)
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  // কোন record নিয়ে notification (যেমন "Assignment" + তার id)
  entityType: string | null;
  entityId: string | null;
  isRead: boolean;
  readAt: string | null;
  emailSent: boolean;
  createdAt: string;
  userId: string;
}

// GET /notifications এর query param
export type NotificationListParams = {
  page?: number;
  limit?: number;
  // "true" | "false"; ফাঁকা মানে সব
  isRead?: "true" | "false" | "";
  type?: NotificationType | "";
};

// GET /notifications/unread-count
export interface UnreadCount {
  unreadCount: number;
}

// PATCH /notifications/read-all
export interface MarkAllReadResult {
  updatedCount: number;
}

// DELETE /notifications/clear-read
export interface ClearReadResult {
  deletedCount: number;
}
