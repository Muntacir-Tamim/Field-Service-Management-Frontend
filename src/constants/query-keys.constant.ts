// React Query key factory।
// invalidate করার সময় `queryClient.invalidateQueries({ queryKey: xKeys.all })` দিলে
// ওই module এর সব list/detail একসাথে refetch হবে।

type Params = Record<string, unknown>;

function createKeys<S extends string>(scope: S) {
  return {
    all: [scope] as const,
    lists: () => [scope, "list"] as const,
    list: (params?: Params) => [scope, "list", params ?? {}] as const,
    details: () => [scope, "detail"] as const,
    detail: (id: string) => [scope, "detail", id] as const,
  };
}

export const authKeys = {
  me: ["auth", "me"] as const,
};

export const userKeys = {
  ...createKeys("users"),
  me: ["users", "me"] as const,
};

export const adminUserKeys = createKeys("admin-users");

export const skillKeys = createKeys("skills");

export const technicianKeys = {
  ...createKeys("technicians"),
  mySkills: ["technicians", "me", "skills"] as const,
  available: (params?: Params) =>
    ["technicians", "available", params ?? {}] as const,
};

export const serviceRequestKeys = {
  ...createKeys("service-requests"),
  mine: (params?: Params) =>
    ["service-requests", "mine", params ?? {}] as const,
};

export const assignmentKeys = {
  ...createKeys("assignments"),
  mine: (params?: Params) => ["assignments", "mine", params ?? {}] as const,
};

export const workOrderKeys = {
  ...createKeys("work-orders"),
  mine: (params?: Params) => ["work-orders", "mine", params ?? {}] as const,
  byServiceRequest: (serviceRequestId: string) =>
    ["work-orders", "service-request", serviceRequestId] as const,
};

export const paymentKeys = {
  ...createKeys("payments"),
  invoices: (params?: Params) =>
    ["payments", "invoices", params ?? {}] as const,
  invoice: (id: string) => ["payments", "invoices", id] as const,
};

export const feedbackKeys = createKeys("feedbacks");

export const notificationKeys = {
  ...createKeys("notifications"),
  unreadCount: ["notifications", "unread-count"] as const,
};

export const analyticsKeys = {
  all: ["analytics"] as const,
  admin: ["analytics", "admin"] as const,
  technician: ["analytics", "technician"] as const,
  customer: ["analytics", "customer"] as const,
  technicianPerformance: (params?: Params) =>
    ["analytics", "technician-performance", params ?? {}] as const,
};

export const auditLogKeys = createKeys("audit-logs");
