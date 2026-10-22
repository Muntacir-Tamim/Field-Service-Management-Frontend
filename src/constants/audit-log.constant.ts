import { ADMIN_ROUTES } from "@/routes";
import type { AuditAction } from "@/types";
import { humanizeEnum } from "@/utils";
import type { StatusTone } from "./status.constant";

export const AUDIT_ACTIONS: AuditAction[] = [
  "SERVICE_REQUEST_CREATED",
  "SERVICE_REQUEST_STATUS_CHANGED",
  "ASSIGNMENT_CREATED",
  "ASSIGNMENT_CONFIRMED",
  "ASSIGNMENT_CANCELLED",
  "ASSIGNMENT_RESCHEDULED",
  "WORK_ORDER_STATUS_CHANGED",
  "INVOICE_CREATED",
  "PAYMENT_INITIATED",
  "PAYMENT_PAID",
  "PAYMENT_FAILED",
  "PAYMENT_CANCELLED",
  "PAYMENT_REFUNDED",
  "TECHNICIAN_REVIEWED",
  "SKILL_CREATED",
  "SKILL_UPDATED",
  "SKILL_DELETED",
  "FEEDBACK_DELETED",
  "USER_BLOCKED",
  "USER_UNBLOCKED",
  "USER_DELETED",
  "USER_PROFILE_UPDATED",
];

export const AUDIT_ACTION_OPTIONS = AUDIT_ACTIONS.map((value) => ({
  value,
  label: humanizeEnum(value),
}));

const DANGER: AuditAction[] = [
  "USER_BLOCKED",
  "USER_DELETED",
  "SKILL_DELETED",
  "FEEDBACK_DELETED",
  "PAYMENT_FAILED",
  "ASSIGNMENT_CANCELLED",
];
const SUCCESS: AuditAction[] = [
  "PAYMENT_PAID",
  "ASSIGNMENT_CONFIRMED",
  "USER_UNBLOCKED",
  "SKILL_CREATED",
];
const WARNING: AuditAction[] = [
  "PAYMENT_CANCELLED",
  "PAYMENT_REFUNDED",
  "ASSIGNMENT_RESCHEDULED",
];

export function getAuditActionTone(action: AuditAction): StatusTone {
  if (DANGER.includes(action)) {
    return "danger";
  }
  if (SUCCESS.includes(action)) {
    return "success";
  }
  if (WARNING.includes(action)) {
    return "warning";
  }
  return "info";
}

export function getAuditEntityHref(entityType: string, entityId: string) {
  switch (entityType) {
    case "ServiceRequest":
      return `${ADMIN_ROUTES.serviceRequests}/${entityId}`;
    case "Assignment":
      return `${ADMIN_ROUTES.assignments}/${entityId}`;
    case "WorkOrder":
      return `${ADMIN_ROUTES.workOrders}/${entityId}`;
    case "Payment":
      return `${ADMIN_ROUTES.invoices}/${entityId}`;
    case "Technician":
      return `${ADMIN_ROUTES.technicians}/${entityId}`;
    case "Feedback":
    case "CustomerFeedback":
      return ADMIN_ROUTES.feedbacks;
    case "Skill":
      return ADMIN_ROUTES.skills;
    case "User":
      return ADMIN_ROUTES.users;
    default:
      return null;
  }
}

export const AUDIT_ENTITY_OPTIONS = [
  "ServiceRequest",
  "Assignment",
  "WorkOrder",
  "Payment",
  "Technician",
  "Feedback",
  "Skill",
  "User",
].map((value) => ({
  value,
  label: humanizeEnum(value.replace(/([a-z])([A-Z])/g, "$1_$2")),
}));
