import type {
  AssignmentStatus,
  PaymentStatus,
  Priority,
  ServiceRequestStatus,
  SkillLevel,
  TechnicianVerificationStatus,
  UserRole,
  UserStatus,
  WorkOrderStatus,
} from "@/types";

export type StatusTone = "neutral" | "info" | "warning" | "success" | "danger";

export interface StatusMeta {
  label: string;
  tone: StatusTone;
}

export const SERVICE_REQUEST_STATUS: Record<ServiceRequestStatus, StatusMeta> =
  {
    PENDING: { label: "Pending", tone: "warning" },
    UNDER_REVIEW: { label: "Under review", tone: "info" },
    APPROVED: { label: "Approved", tone: "success" },
    REJECTED: { label: "Rejected", tone: "danger" },
    CANCELLED: { label: "Cancelled", tone: "neutral" },
    COMPLETED: { label: "Completed", tone: "success" },
  };

export const ASSIGNMENT_STATUS: Record<AssignmentStatus, StatusMeta> = {
  PENDING: { label: "Awaiting technician", tone: "warning" },
  CONFIRMED: { label: "Confirmed", tone: "success" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};

export const WORK_ORDER_STATUS: Record<WorkOrderStatus, StatusMeta> = {
  SCHEDULED: { label: "Scheduled", tone: "info" },
  TECHNICIAN_EN_ROUTE: { label: "On the way", tone: "info" },
  ARRIVED: { label: "Arrived", tone: "info" },
  IN_PROGRESS: { label: "In progress", tone: "warning" },
  COMPLETED: { label: "Completed", tone: "success" },
  VERIFIED: { label: "Verified", tone: "success" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};

export const PAYMENT_STATUS: Record<PaymentStatus, StatusMeta> = {
  UNPAID: { label: "Unpaid", tone: "warning" },
  PAID: { label: "Paid", tone: "success" },
  FAILED: { label: "Failed", tone: "danger" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
  REFUNDED: { label: "Refunded", tone: "info" },
};

export const PRIORITY: Record<Priority, StatusMeta> = {
  LOW: { label: "Low", tone: "neutral" },
  MEDIUM: { label: "Medium", tone: "info" },
  HIGH: { label: "High", tone: "warning" },
  URGENT: { label: "Urgent", tone: "danger" },
};

export const TECHNICIAN_VERIFICATION_STATUS: Record<
  TechnicianVerificationStatus,
  StatusMeta
> = {
  PENDING: { label: "Pending review", tone: "warning" },
  APPROVED: { label: "Approved", tone: "success" },
  REJECTED: { label: "Rejected", tone: "danger" },
};

export const USER_STATUS: Record<UserStatus, StatusMeta> = {
  ACTIVE: { label: "Active", tone: "success" },
  BLOCKED: { label: "Blocked", tone: "danger" },
  DELETED: { label: "Deleted", tone: "neutral" },
};

export const USER_ROLE: Record<UserRole, StatusMeta> = {
  CUSTOMER: { label: "Customer", tone: "info" },
  TECHNICIAN: { label: "Technician", tone: "warning" },
  ADMIN: { label: "Admin", tone: "success" },
};

export const SKILL_LEVEL: Record<SkillLevel, StatusMeta> = {
  BEGINNER: { label: "Beginner", tone: "neutral" },
  INTERMEDIATE: { label: "Intermediate", tone: "info" },
  EXPERT: { label: "Expert", tone: "success" },
};

// <StatusBadge kind="workOrder" value="IN_PROGRESS" /> এ kind এর key গুলো এখান থেকে
export const STATUS_MAPS = {
  serviceRequest: SERVICE_REQUEST_STATUS,
  assignment: ASSIGNMENT_STATUS,
  workOrder: WORK_ORDER_STATUS,
  payment: PAYMENT_STATUS,
  priority: PRIORITY,
  technician: TECHNICIAN_VERIFICATION_STATUS,
  user: USER_STATUS,
  role: USER_ROLE,
  skillLevel: SKILL_LEVEL,
} as const;

export type StatusKind = keyof typeof STATUS_MAPS;

// filter dropdown এর জন্য: { PENDING: {label} } → [{ value: "PENDING", label }]
export function toOptions<T extends string>(map: Record<T, StatusMeta>) {
  return (Object.keys(map) as T[]).map((value) => ({
    value,
    label: map[value].label,
  }));
}

export const SERVICE_REQUEST_STATUS_OPTIONS = toOptions(SERVICE_REQUEST_STATUS);
export const ASSIGNMENT_STATUS_OPTIONS = toOptions(ASSIGNMENT_STATUS);
export const WORK_ORDER_STATUS_OPTIONS = toOptions(WORK_ORDER_STATUS);
export const PAYMENT_STATUS_OPTIONS = toOptions(PAYMENT_STATUS);
export const PRIORITY_OPTIONS = toOptions(PRIORITY);
export const TECHNICIAN_VERIFICATION_OPTIONS = toOptions(
  TECHNICIAN_VERIFICATION_STATUS,
);
export const USER_STATUS_OPTIONS = toOptions(USER_STATUS);
export const USER_ROLE_OPTIONS = toOptions(USER_ROLE);
export const SKILL_LEVEL_OPTIONS = toOptions(SKILL_LEVEL);

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
