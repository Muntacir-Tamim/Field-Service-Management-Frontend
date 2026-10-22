import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  clearReadNotifications,
  deleteNotification,
  getMyNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/api";
import { notificationKeys } from "@/constants";
import type { NotificationListParams } from "@/types";

const UNREAD_POLL_MS = 30_000;

export function useGetNotifications(
  params?: NotificationListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => getMyNotifications(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useGetUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: getUnreadCount,
    refetchInterval: UNREAD_POLL_MS,
  });
}

function useNotificationMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkNotificationAsRead() {
  return useNotificationMutation(markNotificationAsRead);
}

export function useMarkAllNotificationsAsRead() {
  return useNotificationMutation(markAllNotificationsAsRead);
}

export function useDeleteNotification() {
  return useNotificationMutation(deleteNotification);
}

export function useClearReadNotifications() {
  return useNotificationMutation(clearReadNotifications);
}
