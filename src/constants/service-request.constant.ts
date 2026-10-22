import type { ServiceRequestStatus } from "@/types";

export const CANCELLABLE_REQUEST_STATUSES: ServiceRequestStatus[] = [
  "PENDING",
  "UNDER_REVIEW",
];

export function canCancelServiceRequest(status: ServiceRequestStatus) {
  return CANCELLABLE_REQUEST_STATUSES.includes(status);
}

export const REQUEST_MAX_ATTACHMENTS = 5;
export const REQUEST_MAX_FILE_MB = 5;
export const REQUEST_ATTACHMENT_ACCEPT = "image/*,.pdf";

export function canReviewServiceRequest(status: ServiceRequestStatus) {
  return status === "PENDING" || status === "UNDER_REVIEW";
}
