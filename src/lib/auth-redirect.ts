import type { UserRole } from "@/types";

const DASHBOARD_PATH: Record<UserRole, string> = {
  CUSTOMER: "/dashboard",
  TECHNICIAN: "/technician",
  ADMIN: "/admin",
};

export function getDashboardPath(role: UserRole): string {
  return DASHBOARD_PATH[role] ?? "/";
}
