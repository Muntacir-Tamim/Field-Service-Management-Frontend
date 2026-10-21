import apiClient from "@/lib/apiClient";
import type {
  AddPartPayload,
  ApiResponse,
  CompleteWorkPayload,
  MyWorkOrderListParams,
  ServiceReport,
  ServiceReportPayload,
  StartWorkPayload,
  WorkOrderAttachment,
  WorkOrderDetail,
  WorkOrderListItem,
  WorkOrderListParams,
  WorkOrderPart,
} from "@/types";
import { cleanParams } from "@/utils";

// ADMIN
export function getWorkOrders(params?: WorkOrderListParams) {
  return apiClient<ApiResponse<WorkOrderListItem[]>>("/work-orders", {
    query: cleanParams(params),
  });
}

// TECHNICIAN
export function getMyWorkOrders(params?: MyWorkOrderListParams) {
  return apiClient<ApiResponse<WorkOrderListItem[]>>(
    "/work-orders/my-work-orders",
    { query: cleanParams(params) },
  );
}

// CUSTOMER + TECHNICIAN + ADMIN (নিজের access থাকলে)
export function getWorkOrderById(workOrderId: string) {
  return apiClient<ApiResponse<WorkOrderDetail>>(`/work-orders/${workOrderId}`);
}

export function getWorkOrdersByServiceRequest(serviceRequestId: string) {
  return apiClient<ApiResponse<WorkOrderDetail[]>>(
    `/work-orders/service-request/${serviceRequestId}`,
  );
}

// ---------- TECHNICIAN: status flow ----------

// SCHEDULED → TECHNICIAN_EN_ROUTE
export function markEnRoute(workOrderId: string) {
  return apiClient<ApiResponse<WorkOrderDetail>>(
    `/work-orders/${workOrderId}/en-route`,
    { method: "PATCH" },
  );
}

// TECHNICIAN_EN_ROUTE → ARRIVED
export function markArrived(workOrderId: string) {
  return apiClient<ApiResponse<WorkOrderDetail>>(
    `/work-orders/${workOrderId}/arrived`,
    { method: "PATCH" },
  );
}

// ARRIVED → IN_PROGRESS
export function startWork(workOrderId: string, payload: StartWorkPayload) {
  return apiClient<ApiResponse<WorkOrderDetail>>(
    `/work-orders/${workOrderId}/start`,
    { method: "PATCH", body: payload },
  );
}

// IN_PROGRESS → COMPLETED (multipart, completionImage ঐচ্ছিক)
export function completeWork(
  workOrderId: string,
  payload: CompleteWorkPayload,
) {
  const formData = new FormData();
  formData.append("laborHours", String(payload.laborHours));
  formData.append("completionNotes", payload.completionNotes);
  if (payload.completionImage) {
    formData.append("completionImage", payload.completionImage);
  }
  return apiClient<ApiResponse<WorkOrderDetail>>(
    `/work-orders/${workOrderId}/complete`,
    { method: "PATCH", body: formData },
  );
}

// ---------- TECHNICIAN: parts / attachments / report ----------

export function addPart(workOrderId: string, payload: AddPartPayload) {
  return apiClient<ApiResponse<WorkOrderPart>>(
    `/work-orders/${workOrderId}/parts`,
    { method: "POST", body: payload },
  );
}

export function removePart(workOrderId: string, partId: string) {
  return apiClient<ApiResponse<{ id: string }>>(
    `/work-orders/${workOrderId}/parts/${partId}`,
    { method: "DELETE" },
  );
}

// field name "attachments", একবারে সর্বোচ্চ ৫টা (মোট ২০টা); response এ সব attachment
export function addAttachments(workOrderId: string, files: File[]) {
  const formData = new FormData();
  for (const file of files) {
    formData.append("attachments", file);
  }
  return apiClient<ApiResponse<WorkOrderAttachment[]>>(
    `/work-orders/${workOrderId}/attachments`,
    { method: "POST", body: formData },
  );
}

export function removeAttachment(workOrderId: string, attachmentId: string) {
  return apiClient<ApiResponse<{ id: string }>>(
    `/work-orders/${workOrderId}/attachments/${attachmentId}`,
    { method: "DELETE" },
  );
}

export function saveServiceReport(
  workOrderId: string,
  payload: ServiceReportPayload,
) {
  return apiClient<ApiResponse<ServiceReport>>(
    `/work-orders/${workOrderId}/service-report`,
    { method: "PUT", body: payload },
  );
}

// ---------- ADMIN ----------

// COMPLETED → VERIFIED (service report না থাকলে backend 400)
export function verifyWorkOrder(workOrderId: string) {
  return apiClient<ApiResponse<WorkOrderDetail>>(
    `/work-orders/${workOrderId}/verify`,
    { method: "PATCH" },
  );
}
