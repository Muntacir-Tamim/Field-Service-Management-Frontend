import type { NotificationType } from "./enum.type";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;

  entityType: string | null;
  entityId: string | null;
  isRead: boolean;
  readAt: string | null;
  emailSent: boolean;
  createdAt: string;
  userId: string;
}

export type NotificationListParams = {
  page?: number;
  limit?: number;

  isRead?: "true" | "false" | "";
  type?: NotificationType | "";
};

export interface UnreadCount {
  unreadCount: number;
}

export interface MarkAllReadResult {
  updatedCount: number;
}

export interface ClearReadResult {
  deletedCount: number;
}
