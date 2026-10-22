import type { AssignmentWithRelations, WorkOrderStatus } from "@/types";

export const WORK_ORDER_STEPS: { status: WorkOrderStatus; label: string }[] = [
  { status: "SCHEDULED", label: "Scheduled" },
  { status: "TECHNICIAN_EN_ROUTE", label: "On the way" },
  { status: "ARRIVED", label: "Arrived" },
  { status: "IN_PROGRESS", label: "In progress" },
  { status: "COMPLETED", label: "Completed" },
  { status: "VERIFIED", label: "Verified" },
];

export function getWorkOrderStepIndex(status: WorkOrderStatus) {
  return WORK_ORDER_STEPS.findIndex((step) => step.status === status);
}

export type WorkOrderNextAction =
  | "EN_ROUTE"
  | "ARRIVED"
  | "START"
  | "COMPLETE"
  | null;

export function getNextWorkOrderAction(
  status: WorkOrderStatus,
): WorkOrderNextAction {
  switch (status) {
    case "SCHEDULED":
      return "EN_ROUTE";
    case "TECHNICIAN_EN_ROUTE":
      return "ARRIVED";
    case "ARRIVED":
      return "START";
    case "IN_PROGRESS":
      return "COMPLETE";
    default:
      return null;
  }
}

export function canEditParts(status: WorkOrderStatus) {
  return status === "IN_PROGRESS";
}

export function canEditAttachments(status: WorkOrderStatus) {
  return status === "ARRIVED" || status === "IN_PROGRESS";
}

export function canEditServiceReport(status: WorkOrderStatus) {
  return status === "IN_PROGRESS" || status === "COMPLETED";
}

export function canVerifyWorkOrder(status: WorkOrderStatus) {
  return status === "COMPLETED";
}

type AssignmentLike = Pick<AssignmentWithRelations, "status" | "workOrder">;

function isStillAdjustable(assignment: AssignmentLike) {
  const active =
    assignment.status === "PENDING" || assignment.status === "CONFIRMED";
  const notStarted =
    !assignment.workOrder || assignment.workOrder.status === "SCHEDULED";
  return active && notStarted;
}

export function canCancelAssignment(assignment: AssignmentLike) {
  return isStillAdjustable(assignment);
}

export function canRescheduleAssignment(assignment: AssignmentLike) {
  return isStillAdjustable(assignment);
}

export function canConfirmAssignment(assignment: AssignmentLike) {
  return assignment.status === "PENDING";
}
