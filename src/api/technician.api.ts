import apiClient from "@/lib/apiClient";
import type { ApiResponse, ApplyAsTechnicianInput } from "@/types";

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

// NOTE: Step 5 (Technician module) এ বাকি function এই file এই যোগ হবে
