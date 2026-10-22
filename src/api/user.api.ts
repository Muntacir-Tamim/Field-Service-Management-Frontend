import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  MyProfile,
  ProfileImageResult,
  UpdateMyProfilePayload,
} from "@/types";

export function getMyProfile() {
  return apiClient<ApiResponse<MyProfile>>("/user/me");
}

export function updateMyProfile(payload: UpdateMyProfilePayload) {
  return apiClient<ApiResponse<MyProfile>>("/user/me", {
    method: "PATCH",
    body: payload,
  });
}

export function uploadProfileImage(file: File) {
  const formData = new FormData();
  formData.append("profileImage", file);

  return apiClient<ApiResponse<ProfileImageResult>>("/user/me/profile-image", {
    method: "PATCH",
    body: formData,
  });
}
