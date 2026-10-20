// Backend `prisma/schema/enums.prisma` এর সাথে হুবহু মিল রাখা হয়েছে।
// নতুন enum যোগ হলে এখানেই যোগ করো, আলাদা type file এ duplicate করবে না।

export type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";
export type AuthProvider = "GOOGLE" | "CREDENTIAL";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "EXPERT";
export type TechnicianVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ServiceRequestStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export type AssignmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export type WorkOrderStatus =
  | "SCHEDULED"
  | "TECHNICIAN_EN_ROUTE"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "VERIFIED"
  | "CANCELLED";

export type PaymentStatus =
  | "UNPAID"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentMethod = "BKASH";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type NotificationType =
  | "SERVICE_REQUEST_CREATED"
  | "SERVICE_REQUEST_UNDER_REVIEW"
  | "SERVICE_REQUEST_APPROVED"
  | "SERVICE_REQUEST_REJECTED"
  | "SERVICE_REQUEST_CANCELLED"
  | "ASSIGNMENT_CREATED"
  | "ASSIGNMENT_CONFIRMED"
  | "ASSIGNMENT_CANCELLED"
  | "ASSIGNMENT_RESCHEDULED"
  | "VISIT_REMINDER"
  | "TECHNICIAN_EN_ROUTE"
  | "TECHNICIAN_ARRIVED"
  | "WORK_STARTED"
  | "WORK_COMPLETED"
  | "WORK_VERIFIED"
  | "INVOICE_CREATED"
  | "PAYMENT_RECEIVED"
  | "PAYMENT_REFUNDED"
  | "FEEDBACK_RECEIVED"
  | "TECHNICIAN_APPLICATION_SUBMITTED"
  | "TECHNICIAN_APPLICATION_REVIEWED"
  | "GENERAL";

export type AuditAction =
  | "SERVICE_REQUEST_CREATED"
  | "SERVICE_REQUEST_STATUS_CHANGED"
  | "ASSIGNMENT_CREATED"
  | "ASSIGNMENT_CONFIRMED"
  | "ASSIGNMENT_CANCELLED"
  | "ASSIGNMENT_RESCHEDULED"
  | "WORK_ORDER_STATUS_CHANGED"
  | "INVOICE_CREATED"
  | "PAYMENT_INITIATED"
  | "PAYMENT_PAID"
  | "PAYMENT_FAILED"
  | "PAYMENT_CANCELLED"
  | "PAYMENT_REFUNDED"
  | "TECHNICIAN_REVIEWED"
  | "SKILL_CREATED"
  | "SKILL_UPDATED"
  | "SKILL_DELETED"
  | "FEEDBACK_DELETED"
  | "USER_BLOCKED"
  | "USER_UNBLOCKED"
  | "USER_DELETED"
  | "USER_PROFILE_UPDATED";

// list endpoint এর common query param (README: API Conventions)
export type SortOrder = "asc" | "desc";
