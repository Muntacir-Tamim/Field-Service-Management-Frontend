import type {
  PaymentMethod,
  PaymentStatus,
  ServiceRequestStatus,
  SortOrder,
  WorkOrderStatus,
} from "./enum.type";
import type { WorkOrderPart } from "./work-order.type";

// NOTE: Decimal field (subtotal, taxAmount, discount, totalAmount, refundAmount,
// laborHours) backend থেকে string হয়ে আসে। দেখানোর সময় formatCurrency() ব্যবহার করো।

// backend `toInvoiceView()` এর breakdown (সব মান string)
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

// Backend `Payment` model = একটা invoice।
// GET /payment/invoices, /payment/my-invoices, /payment/invoices/:id সবগুলোর shape এক
export interface Invoice {
  id: string;
  status: PaymentStatus;
  // invoice এ এখনো payment শুরু না হলে null
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
  // bKash এর trxID (PAID হওয়ার পর)
  transactionId: string | null;
  payerReference: string | null;
  // gateway এর raw response; UI তে দেখানো হয় না
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
  // createdAt | paidAt | totalAmount | status
  sortBy?: string;
  sortOrder?: SortOrder;
  status?: PaymentStatus | "";
  // createdAt এর range (ISO date)
  from?: string;
  to?: string;
};

// POST /payment/initiate (CUSTOMER)
export interface InitiatePaymentPayload {
  paymentId: string;
}

// bKash `tokenized/checkout/create` এর response (backend সরাসরি data তে পাঠায়)।
// customer কে `bkashURL` এ redirect করতে হয়।
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

// bKash থেকে ফেরার পর backend এই value দিয়ে
// `/dashboard/payments?status=<value>` এ redirect করে
export type PaymentCallbackStatus = "success" | "failure" | "cancel";

// PATCH /payment/invoices/:id/refund (ADMIN, পুরো amount ফেরত যায়)
export interface RefundInvoicePayload {
  reason: string;
}

// POST /payment/invoices (ADMIN; work order VERIFIED হতে হবে)
export interface CreateInvoicePayload {
  workOrderId: string;
  discount?: number;
  // না দিলে backend এর default tax rate
  taxPercent?: number;
  // ISO string
  dueDate?: string;
  notes?: string;
}
