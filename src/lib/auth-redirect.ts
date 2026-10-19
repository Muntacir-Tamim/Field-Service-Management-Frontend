import type { UserRole } from "@/types";

const DASHBOARD_PATH: Record<UserRole, string> = {
  CUSTOMER: "/dashboard",
  TECHNICIAN: "/technician",
  ADMIN: "/admin",
};

// role অনুযায়ী login এর পর কোন dashboard এ যাবে
export function getDashboardPath(role: UserRole): string {
  return DASHBOARD_PATH[role] ?? "/";
}
