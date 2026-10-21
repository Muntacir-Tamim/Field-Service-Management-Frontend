import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  MyProfile,
  ProfileImageResult,
  UpdateMyProfilePayload,
} from "@/types";

// সব role: GET /users/me (role profile `profile` key তে)
export function getMyProfile() {
  return apiClient<ApiResponse<MyProfile>>("/users/me");
}

// সব role: নিজের profile update। body role অনুযায়ী বদলায়, অন্তত ১টা field লাগে
export function updateMyProfile(payload: UpdateMyProfilePayload) {
  return apiClient<ApiResponse<MyProfile>>("/users/me", {
    method: "PATCH",
    body: payload,
  });
}

// সব role: profile ছবি (multipart, field নাম `profileImage`)
export function uploadProfileImage(file: File) {
  const formData = new FormData();
  formData.append("profileImage", file);

  return apiClient<ApiResponse<ProfileImageResult>>("/users/me/profile-image", {
    method: "PATCH",
    body: formData,
  });
}
