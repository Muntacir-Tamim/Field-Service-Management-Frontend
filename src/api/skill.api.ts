import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateSkillPayload,
  Skill,
  SkillListParams,
  UpdateSkillPayload,
} from "@/types";
import { cleanParams } from "@/utils";

// public endpoint; category + searchTerm দিয়ে filter করা যায়
export function getSkills(params?: SkillListParams) {
  return apiClient<ApiResponse<Skill[]>>("/skills", {
    query: cleanParams(params),
  });
}

// ADMIN only
export function createSkill(payload: CreateSkillPayload) {
  return apiClient<ApiResponse<Skill>>("/skills", {
    method: "POST",
    body: payload,
  });
}

export function updateSkill(skillId: string, payload: UpdateSkillPayload) {
  return apiClient<ApiResponse<Skill>>(`/skills/${skillId}`, {
    method: "PATCH",
    body: payload,
  });
}

// soft delete; কোনো technician ব্যবহার করলে backend 409 দেয়
export function deleteSkill(skillId: string) {
  return apiClient<ApiResponse<null>>(`/skills/${skillId}`, {
    method: "DELETE",
  });
}
