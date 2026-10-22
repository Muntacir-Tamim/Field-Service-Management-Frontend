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

export function getAllInvoices(params?: InvoiceListParams) {
  return apiClient<ApiResponse<Invoice[]>>("/payment/invoices", {
    query: cleanParams(params),
  });
}

export function getMyInvoices(params?: InvoiceListParams) {
  return apiClient<ApiResponse<Invoice[]>>("/payment/my-invoices", {
    query: cleanParams(params),
  });
}

export function getInvoiceById(paymentId: string) {
  return apiClient<ApiResponse<Invoice>>(`/payment/invoices/${paymentId}`);
}

export function initiatePayment(paymentId: string) {
  return apiClient<ApiResponse<InitiatePaymentResult>>("/payment/initiate", {
    method: "POST",
    body: { paymentId },
  });
}

export function refundInvoice(
  paymentId: string,
  payload: RefundInvoicePayload,
) {
  return apiClient<ApiResponse<Invoice>>(
    `/payment/invoices/${paymentId}/refund`,
    { method: "PATCH", body: payload },
  );
}

export function createInvoice(payload: CreateInvoicePayload) {
  return apiClient<ApiResponse<Invoice>>("/payment/invoices", {
    method: "POST",
    body: payload,
  });
}

export function downloadInvoicePdf(paymentId: string) {
  return apiClient<Blob>(`/payment/invoices/${paymentId}/pdf`, {
    responseType: "blob" as never,
  });
}
