import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateInvoicePayload,
  InitiatePaymentResult,
  Invoice,
  InvoiceListParams,
  RefundInvoicePayload,
} from "@/types";
import { cleanParams } from "@/utils";

// NOTE: backend এ route টা `/payment` (এক বচন), `/payments` নয়।
// `GET /payment/callback` frontend call করে না; bKash browser কে সেখানে পাঠায়,
// তারপর backend আমাদের `/dashboard/payments?status=...` এ redirect করে।

// ADMIN
export function getAllInvoices(params?: InvoiceListParams) {
  return apiClient<ApiResponse<Invoice[]>>("/payment/invoices", {
    query: cleanParams(params),
  });
}

// CUSTOMER
export function getMyInvoices(params?: InvoiceListParams) {
  return apiClient<ApiResponse<Invoice[]>>("/payment/my-invoices", {
    query: cleanParams(params),
  });
}

// CUSTOMER (শুধু নিজের) + ADMIN
export function getInvoiceById(paymentId: string) {
  return apiClient<ApiResponse<Invoice>>(`/payment/invoices/${paymentId}`);
}

// CUSTOMER: bKash payment শুরু; response এর `bkashURL` এ redirect করতে হবে
export function initiatePayment(paymentId: string) {
  return apiClient<ApiResponse<InitiatePaymentResult>>("/payment/initiate", {
    method: "POST",
    body: { paymentId },
  });
}

// ADMIN: PAID invoice পুরো refund (শুধু bKash এর মাধ্যমে)
export function refundInvoice(
  paymentId: string,
  payload: RefundInvoicePayload,
) {
  return apiClient<ApiResponse<Invoice>>(
    `/payment/invoices/${paymentId}/refund`,
    { method: "PATCH", body: payload },
  );
}

// ADMIN: VERIFIED work order এর invoice তৈরি
export function createInvoice(payload: CreateInvoicePayload) {
  return apiClient<ApiResponse<Invoice>>("/payment/invoices", {
    method: "POST",
    body: payload,
  });
}

// CUSTOMER + ADMIN: PDF binary আসে (JSON নয়), তাই blob হিসেবে নিতে হয়।
// apiClient এর option type শুধু JSON ধরে, তাই responseType এ `as never` cast।
// runtime এ ofetch ঠিকই "blob" ধরে, আর 401 হলে token refresh ও কাজ করে।
export function downloadInvoicePdf(paymentId: string) {
  return apiClient<Blob>(`/payment/invoices/${paymentId}/pdf`, {
    responseType: "blob" as never,
  });
}
