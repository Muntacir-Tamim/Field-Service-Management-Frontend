import type {
  AssignmentStatus,
  PaymentStatus,
  Priority,
  ServiceRequestStatus,
  SortOrder,
  WorkOrderStatus,
} from "./enum.type";

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

export interface WorkOrderListItem extends WorkOrder {
  assignment: WorkOrderAssignment;
  _count: { parts: number; attachments: number };
}

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

export interface StartWorkPayload {
  problemFound: string;
  workDescription: string;
}

export interface CompleteWorkPayload {
  laborHours: number;
  completionNotes: string;

  completionImage?: File | null;
}

export interface AddPartPayload {
  name: string;
  quantity: number;
  unitCost: number;
  notes?: string;
}

export interface ServiceReportPayload {
  summary: string;
  findings: string;
  recommendations?: string;
}
