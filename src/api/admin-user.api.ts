import apiClient from "@/lib/apiClient";
import type {
  AdminUser,
  AdminUserListParams,
  ApiResponse,
  DeleteUserResult,
  UpdateUserStatusPayload,
} from "@/types";
import { cleanParams } from "@/utils";

// সব endpoint শুধু ADMIN এর। route এর prefix `/admin/users`

export function getAdminUsers(params?: AdminUserListParams) {
  return apiClient<ApiResponse<AdminUser[]>>("/admin/users", {
    query: cleanParams(params),
  });
}

// Block / Unblock (নিজেকে আর অন্য ADMIN কে করা যায় না)
export function updateAdminUserStatus(
  userId: string,
  payload: UpdateUserStatusPayload,
) {
  return apiClient<ApiResponse<AdminUser>>(`/admin/users/${userId}/status`, {
    method: "PATCH",
    body: payload,
  });
}

// Soft delete (চলমান কাজ/request থাকলে 409)
export function deleteAdminUser(userId: string) {
  return apiClient<ApiResponse<DeleteUserResult>>(`/admin/users/${userId}`, {
    method: "DELETE",
  });
}
