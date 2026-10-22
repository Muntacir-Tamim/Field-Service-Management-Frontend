import {
  BellIcon,
  CalendarClockIcon,
  ClipboardListIcon,
  CreditCardIcon,
  FileTextIcon,
  type LucideIcon,
  MessageSquareIcon,
  WrenchIcon,
} from "lucide-react";
import type { Notification, NotificationType, UserRole } from "@/types";
import { humanizeEnum } from "@/utils";
import { ADMIN_ROUTES } from "../routes/admin.routes";
import { CUSTOMER_ROUTES } from "../routes/customer.routes";
import { TECHNICIAN_ROUTES } from "../routes/technician.routes";

export function getNotificationIcon(type: NotificationType): LucideIcon {
  if (type.startsWith("SERVICE_REQUEST")) {
    return ClipboardListIcon;
  }
  if (type.startsWith("ASSIGNMENT") || type === "VISIT_REMINDER") {
    return CalendarClockIcon;
  }
  if (type.startsWith("TECHNICIAN")) {
    return WrenchIcon;
  }
  if (type.startsWith("WORK_")) {
    return FileTextIcon;
  }
  if (type.startsWith("INVOICE") || type.startsWith("PAYMENT")) {
    return CreditCardIcon;
  }
  if (type === "FEEDBACK_RECEIVED") {
    return MessageSquareIcon;
  }
  return BellIcon;
}

const NOTIFICATION_TYPES: NotificationType[] = [
  "SERVICE_REQUEST_CREATED",
  "SERVICE_REQUEST_UNDER_REVIEW",
  "SERVICE_REQUEST_APPROVED",
  "SERVICE_REQUEST_REJECTED",
  "SERVICE_REQUEST_CANCELLED",
  "ASSIGNMENT_CREATED",
  "ASSIGNMENT_CONFIRMED",
  "ASSIGNMENT_CANCELLED",
  "ASSIGNMENT_RESCHEDULED",
  "VISIT_REMINDER",
  "TECHNICIAN_EN_ROUTE",
  "TECHNICIAN_ARRIVED",
  "WORK_STARTED",
  "WORK_COMPLETED",
  "WORK_VERIFIED",
  "INVOICE_CREATED",
  "PAYMENT_RECEIVED",
  "PAYMENT_REFUNDED",
  "FEEDBACK_RECEIVED",
  "TECHNICIAN_APPLICATION_SUBMITTED",
  "TECHNICIAN_APPLICATION_REVIEWED",
  "GENERAL",
];

export const NOTIFICATION_TYPE_OPTIONS = NOTIFICATION_TYPES.map((value) => ({
  value,
  label: humanizeEnum(value),
}));

export const NOTIFICATION_READ_OPTIONS = [
  { value: "false", label: "Unread" },
  { value: "true", label: "Read" },
];

export const NOTIFICATION_ROUTE_BY_ROLE: Record<UserRole, string> = {
  CUSTOMER: CUSTOMER_ROUTES.notifications,
  TECHNICIAN: TECHNICIAN_ROUTES.notifications,
  ADMIN: ADMIN_ROUTES.notifications,
};

export function getNotificationHref(
  notification: Pick<Notification, "entityType" | "entityId">,
  role: UserRole,
): string | null {
  const { entityType, entityId } = notification;
  if (!entityType) {
    return null;
  }

  if (role === "CUSTOMER") {
    if (entityType === "ServiceRequest" && entityId) {
      return `${CUSTOMER_ROUTES.serviceRequests}/${entityId}`;
    }
    if (entityType === "Payment" && entityId) {
      return `${CUSTOMER_ROUTES.payments}/${entityId}`;
    }
    return null;
  }

  if (role === "TECHNICIAN") {
    if (entityType === "Assignment" && entityId) {
      return `${TECHNICIAN_ROUTES.assignments}/${entityId}`;
    }
    if (entityType === "WorkOrder" && entityId) {
      return `${TECHNICIAN_ROUTES.workOrders}/${entityId}`;
    }
    if (entityType === "Feedback" || entityType === "CustomerFeedback") {
      return TECHNICIAN_ROUTES.feedbacks;
    }
    if (entityType === "Technician") {
      return TECHNICIAN_ROUTES.profile;
    }
    return null;
  }

  // ADMIN
  if (entityType === "ServiceRequest" && entityId) {
    return `${ADMIN_ROUTES.serviceRequests}/${entityId}`;
  }
  if (entityType === "Assignment" && entityId) {
    return `${ADMIN_ROUTES.assignments}/${entityId}`;
  }
  if (entityType === "WorkOrder" && entityId) {
    return `${ADMIN_ROUTES.workOrders}/${entityId}`;
  }
  if (entityType === "Payment" && entityId) {
    return `${ADMIN_ROUTES.invoices}/${entityId}`;
  }
  if (entityType === "Technician" && entityId) {
    return `${ADMIN_ROUTES.technicians}/${entityId}`;
  }
  if (entityType === "Feedback" || entityType === "CustomerFeedback") {
    return ADMIN_ROUTES.feedbacks;
  }
  if (entityType === "User") {
    return ADMIN_ROUTES.users;
  }
  return null;
}
