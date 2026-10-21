import type {
  AssignmentStatus,
  Priority,
  ServiceRequestStatus,
  SortOrder,
  WorkOrderStatus,
} from "./enum.type";
import type { TechnicianSkillEntry } from "./technician.type";

// Backend `Assignment` model এর নিজস্ব field
export interface Assignment {
  id: string;
  status: AssignmentStatus;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  notes: string | null;
  confirmedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  cancelledBy: string | null;
  createdAt: string;
  updatedAt: string;
  serviceRequestId: string;
  technicianId: string;
}

// list / detail / create / confirm / cancel / reschedule সবার response এ এই include থাকে
export interface AssignmentWithRelations extends Assignment {
  serviceRequest: {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: ServiceRequestStatus;
    address: string;
    city: string;
    preferredDate: string | null;
    customer: { id: string; name: string; contactNumber: string | null };
  };
  technician: {
    id: string;
    name: string;
    email: string;
    contactNumber: string | null;
    user: { imageUrl: string };
  };
  workOrder: { id: string; status: WorkOrderStatus } | null;
}

export type AssignmentListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  status?: AssignmentStatus | "";
  technicianId?: string;
  serviceRequestId?: string;
  // ISO date; scheduledStart এর range
  from?: string;
  to?: string;
};

// technician এর নিজের list এ technicianId পাঠানোর দরকার নেই
export type MyAssignmentListParams = Omit<AssignmentListParams, "technicianId">;

// GET /assignments/available-technicians (pagination নেই, array)
export interface AvailableTechnician {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
  experienceYears: number;
  bio: string | null;
  user: { imageUrl: string };
  skills: Pick<TechnicianSkillEntry, "level" | "skill">[];
}

export type AvailableTechnicianParams = {
  // ISO string; দুটোই বাধ্যতামূলক
  scheduledStart: string;
  scheduledEnd: string;
  skillId?: string;
};

// POST /assignments
export interface CreateAssignmentPayload {
  serviceRequestId: string;
  technicianId: string;
  // ISO string
  scheduledStart: string;
  scheduledEnd: string;
  notes?: string;
}

// PATCH /assignments/:id/reschedule (পুরনোটা CANCELLED হয়ে নতুন assignment তৈরি হয়)
export interface ReschedulePayload {
  scheduledStart: string;
  scheduledEnd: string;
  technicianId?: string;
  reason?: string;
  notes?: string;
}

// PATCH /assignments/:id/cancel
export interface CancelAssignmentPayload {
  reason: string;
}
