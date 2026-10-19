import type { UserRole } from "@/types";

export const ROLES = {
  CUSTOMER: "CUSTOMER",
  TECHNICIAN: "TECHNICIAN",
  ADMIN: "ADMIN",
} as const satisfies Record<UserRole, UserRole>;
