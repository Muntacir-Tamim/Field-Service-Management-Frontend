import type {
  AssignmentStatus,
  Priority,
  ServiceRequestStatus,
  SkillLevel,
  SortOrder,
  WorkOrderStatus,
} from "./enum.type";
import type { Skill } from "./skill.type";

export interface ServiceRequestAttachment {
  id: string;
  url: string;
  publicId: string;
  // MIME type, যেমন "image/png" / "application/pdf"
  fileType: string;
  fileName: string | null;
  createdAt: string;
  serviceRequestId: string;
}

// Backend `ServiceRequest` model এর নিজস্ব field
export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: ServiceRequestStatus;
  preferredDate: string | null;
  address: string;
  city: string;
  rejectionReason: string | null;
  reviewedAt: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  adminId: string | null;
}

interface PersonRef {
  name: string;
  email: string;
  imageUrl?: string;
}

// request এর সাথে জুড়ে থাকা customer feedback (deleted হলে backend null দেয়)
export interface ServiceRequestFeedback {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------- GET /service-requests/my-requests ----------

export interface MyRequestAssignment {
  id: string;
  status: AssignmentStatus;
  scheduledStart: string;
  scheduledEnd: string;
  technician: { id: string; user: PersonRef };
}

export interface MyServiceRequest extends ServiceRequest {
  attachments: ServiceRequestAttachment[];
  // শুধু CONFIRMED assignment আসে
  assignments: MyRequestAssignment[];
  feedback: ServiceRequestFeedback | null;
}

export type MyServiceRequestParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  status?: ServiceRequestStatus | "";
  priority?: Priority | "";
};

// ---------- GET /service-requests/:id ----------

export interface DetailWorkOrder {
  id: string;
  status: WorkOrderStatus;
  startedAt: string | null;
  completedAt: string | null;
  verifiedAt: string | null;
}

export interface DetailAssignment {
  id: string;
  status: AssignmentStatus;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  notes: string | null;
  cancelReason: string | null;
  createdAt: string;
  technicianId: string;
  technician: {
    id: string;
    user: PersonRef;
    skills: { level: SkillLevel; skill: Skill }[];
  };
  workOrder: DetailWorkOrder | null;
}

export interface ServiceRequestDetail extends ServiceRequest {
  customer: {
    id: string;
    contactNumber: string | null;
    address: string | null;
    city: string | null;
    userId: string;
    user: PersonRef;
  };
  admin: { id: string; userId: string; user: PersonRef } | null;
  attachments: ServiceRequestAttachment[];
  assignments: DetailAssignment[];
  feedback: ServiceRequestFeedback | null;
}

// ---------- POST /service-requests (multipart/form-data) ----------

export interface CreateServiceRequestPayload {
  title: string;
  description: string;
  priority?: Priority;
  // ISO string
  preferredDate?: string;
  address: string;
  city: string;
  // field name "attachments", সর্বোচ্চ ৫টা
  attachments?: File[];
}

// ---------- ADMIN: GET /service-requests ----------

export interface AdminServiceRequest extends ServiceRequest {
  customer: {
    id: string;
    contactNumber: string | null;
    city: string | null;
    user: { name: string; email: string };
  };
  admin: { id: string; user: { name: string } } | null;
  attachments: ServiceRequestAttachment[];
  // সর্বশেষ ১টা assignment
  assignments: {
    id: string;
    status: AssignmentStatus;
    scheduledStart: string;
  }[];
}

export type AdminServiceRequestParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  status?: ServiceRequestStatus | "";
  priority?: Priority | "";
  city?: string;
};

// ---------- ADMIN: PATCH /service-requests/:id/review ----------

export interface ReviewServiceRequestPayload {
  status: "APPROVED" | "REJECTED";
  // REJECTED হলে বাধ্যতামূলক
  rejectionReason?: string;
}
