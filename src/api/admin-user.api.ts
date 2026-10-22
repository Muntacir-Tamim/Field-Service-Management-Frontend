import apiClient from "@/lib/apiClient";
import type {
  AdminUser,
  AdminUserListParams,
  ApiResponse,
  DeleteUserResult,
  UpdateUserStatusPayload,
} from "@/types";
import { cleanParams } from "@/utils";

export function getAdminUsers(params?: AdminUserListParams) {
  return apiClient<ApiResponse<AdminUser[]>>("/admin/users", {
    query: cleanParams(params),
  });
}

export function updateAdminUserStatus(
  userId: string,
  payload: UpdateUserStatusPayload,
) {
  return apiClient<ApiResponse<AdminUser>>(`/admin/users/${userId}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteAdminUser(userId: string) {
  return apiClient<ApiResponse<DeleteUserResult>>(`/admin/users/${userId}`, {
    method: "DELETE",
  });
}
