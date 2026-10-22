import type {
  PaymentMethod,
  PaymentStatus,
  ServiceRequestStatus,
  SortOrder,
  WorkOrderStatus,
} from "./enum.type";
import type { WorkOrderPart } from "./work-order.type";

export interface InvoiceBreakdown {
  partsTotal: string;
  laborHours: string;
  laborCost: string;
  subtotal: string;
  discount: string;
  taxAmount: string;
  totalAmount: string;
}

export interface InvoiceWorkOrder {
  id: string;
  status: WorkOrderStatus;
  laborHours: string | null;
  problemFound: string | null;
  workDescription: string | null;
  completedAt: string | null;
  verifiedAt: string | null;
  parts: WorkOrderPart[];
  assignment: {
    technician: { id: string; name: string };
    serviceRequest: {
      id: string;
      title: string;
      status: ServiceRequestStatus;
      address: string;
      city: string;
      customer: {
        id: string;
        name: string;
        email: string;
        contactNumber: string | null;
        userId: string;
      };
    };
  };
}

export interface Invoice {
  id: string;
  status: PaymentStatus;

  method: PaymentMethod | null;
  invoiceNumber: string;
  subtotal: string;
  taxAmount: string;
  discount: string;
  totalAmount: string;
  dueDate: string | null;
  notes: string | null;
  currency: string;
  gatewayPaymentId: string | null;

  transactionId: string | null;
  payerReference: string | null;

  gatewayResponse: unknown;
  refundTransactionId: string | null;
  refundAmount: string | null;
  refundReason: string | null;
  refundedAt: string | null;
  sentAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  workOrderId: string;
  workOrder: InvoiceWorkOrder;
  breakdown: InvoiceBreakdown;
}

export type InvoiceListParams = {
  page?: number;
  limit?: number;

  sortBy?: string;
  sortOrder?: SortOrder;
  status?: PaymentStatus | "";

  from?: string;
  to?: string;
};

export interface InitiatePaymentPayload {
  paymentId: string;
}

export interface InitiatePaymentResult {
  paymentID: string;
  bkashURL: string;
  callbackURL?: string;
  successCallbackURL?: string;
  failureCallbackURL?: string;
  cancelledCallbackURL?: string;
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
  paymentCreateTime?: string;
  transactionStatus?: string;
  statusCode: string;
  statusMessage: string;
}

export type PaymentCallbackStatus = "success" | "failure" | "cancel";

export interface RefundInvoicePayload {
  reason: string;
}

export interface CreateInvoicePayload {
  workOrderId: string;
  discount?: number;

  taxPercent?: number;

  dueDate?: string;
  notes?: string;
}
