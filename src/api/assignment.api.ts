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

export function getAvailableTechnicians(params: AvailableTechnicianParams) {
  return apiClient<ApiResponse<AvailableTechnician[]>>(
    "/assignments/available-technicians",
    { query: cleanParams(params) },
  );
}

export function createAssignment(payload: CreateAssignmentPayload) {
  return apiClient<ApiResponse<AssignmentWithRelations>>("/assignments", {
    method: "POST",
    body: payload,
  });
}

export function getAssignments(params?: AssignmentListParams) {
  return apiClient<ApiResponse<AssignmentWithRelations[]>>("/assignments", {
    query: cleanParams(params),
  });
}

export function getMyAssignments(params?: MyAssignmentListParams) {
  return apiClient<ApiResponse<AssignmentWithRelations[]>>(
    "/assignments/my-assignments",
    { query: cleanParams(params) },
  );
}

export function getAssignmentById(assignmentId: string) {
  return apiClient<ApiResponse<AssignmentWithRelations>>(
    `/assignments/${assignmentId}`,
  );
}

export function rescheduleAssignment(
  assignmentId: string,
  payload: ReschedulePayload,
) {
  return apiClient<ApiResponse<AssignmentWithRelations>>(
    `/assignments/${assignmentId}/reschedule`,
    { method: "PATCH", body: payload },
  );
}

export function confirmAssignment(assignmentId: string) {
  return apiClient<ApiResponse<AssignmentWithRelations>>(
    `/assignments/${assignmentId}/confirm`,
    { method: "PATCH" },
  );
}

export function cancelAssignment(
  assignmentId: string,
  payload: CancelAssignmentPayload,
) {
  return apiClient<ApiResponse<AssignmentWithRelations>>(
    `/assignments/${assignmentId}/cancel`,
    { method: "PATCH", body: payload },
  );
}
