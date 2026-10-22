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

export function applyAsTechnician(input: ApplyAsTechnicianInput) {
  return apiClient<ApiResponse<unknown>>("/technicians/apply", {
    method: "POST",
    body: toApplyFormData(input),
  });
}

export function getTechnicians(params?: TechnicianListParams) {
  return apiClient<ApiResponse<Technician[]>>("/technicians", {
    query: cleanParams(params),
  });
}

export function getTechnicianById(technicianId: string) {
  return apiClient<ApiResponse<Technician>>(`/technicians/${technicianId}`);
}

export function reviewTechnician(
  technicianId: string,
  payload: ReviewTechnicianPayload,
) {
  return apiClient<ApiResponse<Technician>>(
    `/technicians/${technicianId}/review`,
    { method: "PATCH", body: payload },
  );
}

export function getMyTechnicianProfile() {
  return apiClient<ApiResponse<Technician>>("/technicians/my-profile");
}

export function updateMyAvailability(isAvailable: boolean) {
  return apiClient<ApiResponse<AvailabilityResult>>(
    "/technicians/my-availability",
    { method: "PATCH", body: { isAvailable } },
  );
}

export function addMySkill(payload: AddMySkillPayload) {
  return apiClient<ApiResponse<TechnicianSkillEntry[]>>(
    "/technicians/my-skills",
    { method: "POST", body: payload },
  );
}

export function removeMySkill(skillId: string) {
  return apiClient<ApiResponse<TechnicianSkillEntry[]>>(
    `/technicians/my-skills/${skillId}`,
    { method: "DELETE" },
  );
}
