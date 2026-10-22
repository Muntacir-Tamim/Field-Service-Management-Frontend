import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateFeedbackPayload,
  DeletedFeedbackResult,
  Feedback,
  FeedbackListParams,
  TechnicianFeedbackResult,
  UpdateFeedbackPayload,
} from "@/types";
import { cleanParams } from "@/utils";

// CUSTOMER: কাজ COMPLETED হলে rating + comment দেওয়া
export function createFeedback(payload: CreateFeedbackPayload) {
  return apiClient<ApiResponse<Feedback>>("/feedbacks", {
    method: "POST",
    body: payload,
  });
}

// CUSTOMER: শুধু নিজের feedback edit (ADMIN পারে না, backend এ শুধু CUSTOMER)
export function updateFeedback(
  feedbackId: string,
  payload: UpdateFeedbackPayload,
) {
  return apiClient<ApiResponse<Feedback>>(`/feedbacks/${feedbackId}`, {
    method: "PATCH",
    body: payload,
  });
}

// CUSTOMER (নিজের) + ADMIN (যেকোনো): soft delete
export function deleteFeedback(feedbackId: string) {
  return apiClient<ApiResponse<DeletedFeedbackResult>>(
    `/feedbacks/${feedbackId}`,
    { method: "DELETE" },
  );
}

// CUSTOMER
export function getMyFeedbacks(params?: FeedbackListParams) {
  return apiClient<ApiResponse<Feedback[]>>("/feedbacks/my-feedbacks", {
    query: cleanParams(params),
  });
}

// ADMIN
export function getAllFeedbacks(params?: FeedbackListParams) {
  return apiClient<ApiResponse<Feedback[]>>("/feedbacks", {
    query: cleanParams(params),
  });
}

// TECHNICIAN: নিজের feedback + rating summary
export function getMyTechnicianFeedbacks(params?: FeedbackListParams) {
  return apiClient<ApiResponse<TechnicianFeedbackResult>>(
    "/feedbacks/technician/my-feedbacks",
    { query: cleanParams(params) },
  );
}

// ADMIN: একজন technician এর feedback + rating summary
export function getTechnicianFeedbacks(
  technicianId: string,
  params?: FeedbackListParams,
) {
  return apiClient<ApiResponse<TechnicianFeedbackResult>>(
    `/feedbacks/technician/${technicianId}`,
    { query: cleanParams(params) },
  );
}

// CUSTOMER / TECHNICIAN / ADMIN: একটা request এর feedback (না থাকলে 404)
export function getFeedbackByServiceRequest(serviceRequestId: string) {
  return apiClient<ApiResponse<Feedback>>(
    `/feedbacks/service-request/${serviceRequestId}`,
  );
}
