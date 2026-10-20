import type { ServiceRequestStatus } from "@/types";

// backend: APPROVED / COMPLETED / CANCELLED cancel করা যায় না;
// REJECTED এ cancel অর্থহীন, তাই customer কে শুধু এই দুই অবস্থায় দেখাই
export const CANCELLABLE_REQUEST_STATUSES: ServiceRequestStatus[] = [
  "PENDING",
  "UNDER_REVIEW",
];

export function canCancelServiceRequest(status: ServiceRequestStatus) {
  return CANCELLABLE_REQUEST_STATUSES.includes(status);
}

// attachment upload এর limit (backend: field "attachments", max 5)
export const REQUEST_MAX_ATTACHMENTS = 5;
export const REQUEST_MAX_FILE_MB = 5;
export const REQUEST_ATTACHMENT_ACCEPT = "image/*,.pdf";
