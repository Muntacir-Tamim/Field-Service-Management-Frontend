import apiClient from "@/lib/apiClient";
import type {
  AddMySkillPayload,
  ApiResponse,
  ApplyAsTechnicianInput,
  AvailabilityResult,
  ReviewTechnicianPayload,
  Technician,
  TechnicianListParams,
  TechnicianSkillEntry,
} from "@/types";
import { cleanParams } from "@/utils";

// ফাইল থাকে বলে multipart/form-data; JSON অংশ `data` field এ string হিসেবে যায়
function toApplyFormData({ data, resume, documents }: ApplyAsTechnicianInput) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (resume) {
    formData.append("resume", resume);
  }
  for (const file of documents ?? []) {
    formData.append("documents", file);
  }
  return formData;
}

// PUBLIC: technician হওয়ার আবেদন। সফল হলে email এ OTP যায়
// (OTP verify এর function auth.api.ts এ আছে: verifyTechnicianAccount)
export function applyAsTechnician(input: ApplyAsTechnicianInput) {
  return apiClient<ApiResponse<unknown>>("/technicians/apply", {
    method: "POST",
    body: toApplyFormData(input),
  });
}

// ADMIN: সব technician (filter + pagination)
export function getTechnicians(params?: TechnicianListParams) {
  return apiClient<ApiResponse<Technician[]>>("/technicians", {
    query: cleanParams(params),
  });
}

// ADMIN
export function getTechnicianById(technicianId: string) {
  return apiClient<ApiResponse<Technician>>(`/technicians/${technicianId}`);
}

// ADMIN: আবেদন approve / reject (email ও notification যায়)
export function reviewTechnician(
  technicianId: string,
  payload: ReviewTechnicianPayload,
) {
  return apiClient<ApiResponse<Technician>>(
    `/technicians/${technicianId}/review`,
    { method: "PATCH", body: payload },
  );
}

// TECHNICIAN: নিজের profile (skills সহ)
export function getMyTechnicianProfile() {
  return apiClient<ApiResponse<Technician>>("/technicians/my-profile");
}

// TECHNICIAN
export function updateMyAvailability(isAvailable: boolean) {
  return apiClient<ApiResponse<AvailabilityResult>>(
    "/technicians/my-availability",
    { method: "PATCH", body: { isAvailable } },
  );
}

// TECHNICIAN: skill যোগ (আগে থাকলে level বদলায়); response এ সব skill এর list
export function addMySkill(payload: AddMySkillPayload) {
  return apiClient<ApiResponse<TechnicianSkillEntry[]>>(
    "/technicians/my-skills",
    { method: "POST", body: payload },
  );
}

// TECHNICIAN: শেষ skill টা মোছা যায় না (backend 400)
export function removeMySkill(skillId: string) {
  return apiClient<ApiResponse<TechnicianSkillEntry[]>>(
    `/technicians/my-skills/${skillId}`,
    { method: "DELETE" },
  );
}
