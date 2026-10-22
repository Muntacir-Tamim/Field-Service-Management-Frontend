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

export function createFeedback(payload: CreateFeedbackPayload) {
  return apiClient<ApiResponse<Feedback>>("/feedbacks", {
    method: "POST",
    body: payload,
  });
}

export function updateFeedback(
  feedbackId: string,
  payload: UpdateFeedbackPayload,
) {
  return apiClient<ApiResponse<Feedback>>(`/feedbacks/${feedbackId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteFeedback(feedbackId: string) {
  return apiClient<ApiResponse<DeletedFeedbackResult>>(
    `/feedbacks/${feedbackId}`,
    { method: "DELETE" },
  );
}

export function getMyFeedbacks(params?: FeedbackListParams) {
  return apiClient<ApiResponse<Feedback[]>>("/feedbacks/my-feedbacks", {
    query: cleanParams(params),
  });
}

export function getAllFeedbacks(params?: FeedbackListParams) {
  return apiClient<ApiResponse<Feedback[]>>("/feedbacks", {
    query: cleanParams(params),
  });
}

export function getMyTechnicianFeedbacks(params?: FeedbackListParams) {
  return apiClient<ApiResponse<TechnicianFeedbackResult>>(
    "/feedbacks/technician/my-feedbacks",
    { query: cleanParams(params) },
  );
}

export function getTechnicianFeedbacks(
  technicianId: string,
  params?: FeedbackListParams,
) {
  return apiClient<ApiResponse<TechnicianFeedbackResult>>(
    `/feedbacks/technician/${technicianId}`,
    { query: cleanParams(params) },
  );
}

export function getFeedbackByServiceRequest(serviceRequestId: string) {
  return apiClient<ApiResponse<Feedback>>(
    `/feedbacks/service-request/${serviceRequestId}`,
  );
}
