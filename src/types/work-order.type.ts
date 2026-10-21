import type {
  AssignmentStatus,
  PaymentStatus,
  Priority,
  ServiceRequestStatus,
  SortOrder,
  WorkOrderStatus,
} from "./enum.type";

// NOTE: Decimal field (laborHours, unitCost, totalCost, totalAmount) backend থেকে string হয়ে আসে

export interface WorkOrderPart {
  id: string;
  name: string;
  quantity: number;
  unitCost: string;
  totalCost: string;
  notes: string | null;
  createdAt: string;
  workOrderId: string;
}

export interface WorkOrderAttachment {
  id: string;
  url: string;
  publicId: string;
  // MIME type
  fileType: string;
  fileName: string | null;
  createdAt: string;
  workOrderId: string;
}

export interface ServiceReport {
  id: string;
  summary: string;
  findings: string;
  recommendations: string | null;
  reportUrl: string | null;
  reportPublicId: string | null;
  createdAt: string;
  updatedAt: string;
  workOrderId: string;
}

// Backend `WorkOrder` model এর নিজস্ব field
export interface WorkOrder {
  id: string;
  status: WorkOrderStatus;
  problemFound: string | null;
  workDescription: string | null;
  laborHours: string | null;
  completionNotes: string | null;
  completionImageUrl: string | null;
  completionPublicId: string | null;
  startedAt: string | null;
  completedAt: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  assignmentId: string;
}

export interface WorkOrderAssignment {
  id: string;
  status: AssignmentStatus;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  technicianId: string;
  technician: {
    id: string;
    name: string;
    email: string;
    contactNumber: string | null;
    userId: string;
  };
  serviceRequest: {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: ServiceRequestStatus;
    address: string;
    city: string;
    customer: {
      id: string;
      name: string;
      contactNumber: string | null;
      userId: string;
    };
  };
}

// GET /work-orders, /work-orders/my-work-orders
export interface WorkOrderListItem extends WorkOrder {
  assignment: WorkOrderAssignment;
  _count: { parts: number; attachments: number };
}

// GET /work-orders/:id এবং status বদলানোর endpoint গুলোর response
export interface WorkOrderDetail extends WorkOrder {
  assignment: WorkOrderAssignment;
  parts: WorkOrderPart[];
  attachments: WorkOrderAttachment[];
  serviceReport: ServiceReport | null;
  payment: {
    id: string;
    invoiceNumber: string;
    status: PaymentStatus;
    totalAmount: string;
  } | null;
  // শুধু GET /work-orders/:id তে আসে; status বদলের response এ থাকে না
  partsTotal?: string;
}

export type WorkOrderListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  status?: WorkOrderStatus | "";
  technicianId?: string;
  serviceRequestId?: string;
  from?: string;
  to?: string;
};

export type MyWorkOrderListParams = Omit<WorkOrderListParams, "technicianId">;

// PATCH /work-orders/:id/start (ARRIVED → IN_PROGRESS)
export interface StartWorkPayload {
  problemFound: string;
  workDescription: string;
}

// PATCH /work-orders/:id/complete (multipart; IN_PROGRESS → COMPLETED)
export interface CompleteWorkPayload {
  laborHours: number;
  completionNotes: string;
  // field name "completionImage", শুধু image
  completionImage?: File | null;
}

// POST /work-orders/:id/parts (IN_PROGRESS এ)
export interface AddPartPayload {
  name: string;
  quantity: number;
  unitCost: number;
  notes?: string;
}

// PUT /work-orders/:id/service-report (IN_PROGRESS বা COMPLETED এ)
export interface ServiceReportPayload {
  summary: string;
  findings: string;
  recommendations?: string;
}
