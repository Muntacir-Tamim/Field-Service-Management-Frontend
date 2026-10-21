import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AssignmentListParams,
  AssignmentWithRelations,
  AvailableTechnician,
  AvailableTechnicianParams,
  CancelAssignmentPayload,
  CreateAssignmentPayload,
  MyAssignmentListParams,
  ReschedulePayload,
} from "@/types";
import { cleanParams } from "@/utils";

// ADMIN: নির্দিষ্ট সময়ে free technician (APPROVED + available + কোনো overlap নেই)
export function getAvailableTechnicians(params: AvailableTechnicianParams) {
  return apiClient<ApiResponse<AvailableTechnician[]>>(
    "/assignments/available-technicians",
    { query: cleanParams(params) },
  );
}

// ADMIN: APPROVED request এ technician বসানো
export function createAssignment(payload: CreateAssignmentPayload) {
  return apiClient<ApiResponse<AssignmentWithRelations>>("/assignments", {
    method: "POST",
    body: payload,
  });
}

// ADMIN
export function getAssignments(params?: AssignmentListParams) {
  return apiClient<ApiResponse<AssignmentWithRelations[]>>("/assignments", {
    query: cleanParams(params),
  });
}

// TECHNICIAN
export function getMyAssignments(params?: MyAssignmentListParams) {
  return apiClient<ApiResponse<AssignmentWithRelations[]>>(
    "/assignments/my-assignments",
    { query: cleanParams(params) },
  );
}

// ADMIN + TECHNICIAN (technician শুধু নিজেরটা)
export function getAssignmentById(assignmentId: string) {
  return apiClient<ApiResponse<AssignmentWithRelations>>(
    `/assignments/${assignmentId}`,
  );
}

// ADMIN: পুরনোটা cancel হয়ে নতুন PENDING assignment তৈরি হয় (response এ নতুনটা)
export function rescheduleAssignment(
  assignmentId: string,
  payload: ReschedulePayload,
) {
  return apiClient<ApiResponse<AssignmentWithRelations>>(
    `/assignments/${assignmentId}/reschedule`,
    { method: "PATCH", body: payload },
  );
}

// TECHNICIAN: PENDING → CONFIRMED (সাথে work order তৈরি হয়)
export function confirmAssignment(assignmentId: string) {
  return apiClient<ApiResponse<AssignmentWithRelations>>(
    `/assignments/${assignmentId}/confirm`,
    { method: "PATCH" },
  );
}

// ADMIN + TECHNICIAN (কাজ শুরুর আগে পর্যন্ত)
export function cancelAssignment(
  assignmentId: string,
  payload: CancelAssignmentPayload,
) {
  return apiClient<ApiResponse<AssignmentWithRelations>>(
    `/assignments/${assignmentId}/cancel`,
    { method: "PATCH", body: payload },
  );
}
