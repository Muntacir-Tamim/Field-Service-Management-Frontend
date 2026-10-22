import apiClient from "@/lib/apiClient";
import type {
  AdminServiceRequest,
  AdminServiceRequestParams,
  ApiResponse,
  CreateServiceRequestPayload,
  MyServiceRequest,
  MyServiceRequestParams,
  ReviewServiceRequestPayload,
  ServiceRequest,
  ServiceRequestAttachment,
  ServiceRequestDetail,
} from "@/types";
import { cleanParams } from "@/utils";

function toFormData(payload: CreateServiceRequestPayload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("address", payload.address);
  formData.append("city", payload.city);
  if (payload.priority) {
    formData.append("priority", payload.priority);
  }
  if (payload.preferredDate) {
    formData.append("preferredDate", payload.preferredDate);
  }
  for (const file of payload.attachments ?? []) {
    formData.append("attachments", file);
  }
  return formData;
}

export function createServiceRequest(payload: CreateServiceRequestPayload) {
  return apiClient<
    ApiResponse<ServiceRequest & { attachments: ServiceRequestAttachment[] }>
  >("/service-requests", {
    method: "POST",
    body: toFormData(payload),
  });
}

export function getMyServiceRequests(params?: MyServiceRequestParams) {
  return apiClient<ApiResponse<MyServiceRequest[]>>(
    "/service-requests/my-requests",
    { query: cleanParams(params) },
  );
}

export function getServiceRequestById(serviceRequestId: string) {
  return apiClient<ApiResponse<ServiceRequestDetail>>(
    `/service-requests/${serviceRequestId}`,
  );
}

export function cancelServiceRequest(serviceRequestId: string) {
  return apiClient<ApiResponse<ServiceRequest>>(
    `/service-requests/${serviceRequestId}/cancel`,
    { method: "PATCH" },
  );
}

export function getAllServiceRequests(params?: AdminServiceRequestParams) {
  return apiClient<ApiResponse<AdminServiceRequest[]>>("/service-requests", {
    query: cleanParams(params),
  });
}

export function markServiceRequestUnderReview(serviceRequestId: string) {
  return apiClient<ApiResponse<ServiceRequest>>(
    `/service-requests/${serviceRequestId}/under-review`,
    { method: "PATCH" },
  );
}

export function reviewServiceRequest(
  serviceRequestId: string,
  payload: ReviewServiceRequestPayload,
) {
  return apiClient<ApiResponse<ServiceRequest>>(
    `/service-requests/${serviceRequestId}/review`,
    { method: "PATCH", body: payload },
  );
}
