import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateServiceRequestPayload,
  MyServiceRequest,
  MyServiceRequestParams,
  ServiceRequest,
  ServiceRequestAttachment,
  ServiceRequestDetail,
} from "@/types";
import { cleanParams } from "@/utils";

// ফাইল থাকে বলে JSON নয়, multipart/form-data (Content-Type browser নিজে বসায়)
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

// CUSTOMER
export function createServiceRequest(payload: CreateServiceRequestPayload) {
  return apiClient<
    ApiResponse<ServiceRequest & { attachments: ServiceRequestAttachment[] }>
  >("/service-requests", {
    method: "POST",
    body: toFormData(payload),
  });
}

// CUSTOMER: নিজের request এর list (pagination সহ)
export function getMyServiceRequests(params?: MyServiceRequestParams) {
  return apiClient<ApiResponse<MyServiceRequest[]>>(
    "/service-requests/my-requests",
    { query: cleanParams(params) },
  );
}

// CUSTOMER / TECHNICIAN / ADMIN (নিজের সম্পর্কিতটা)
export function getServiceRequestById(serviceRequestId: string) {
  return apiClient<ApiResponse<ServiceRequestDetail>>(
    `/service-requests/${serviceRequestId}`,
  );
}

// CUSTOMER: শুধু PENDING / UNDER_REVIEW cancel হয়
export function cancelServiceRequest(serviceRequestId: string) {
  return apiClient<ApiResponse<ServiceRequest>>(
    `/service-requests/${serviceRequestId}/cancel`,
    { method: "PATCH" },
  );
}
