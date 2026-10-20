import type { SidebarItems, UserRole } from "@/types";
import { ADMIN_ROUTES, adminMenu } from "./admin.routes";
import { CUSTOMER_ROUTES, customerMenu } from "./customer.routes";
import { TECHNICIAN_ROUTES, technicianMenu } from "./technician.routes";

export * from "./admin.routes";
export * from "./customer.routes";
export * from "./technician.routes";

const MENU_BY_ROLE: Record<UserRole, SidebarItems> = {
  ADMIN: adminMenu,
  TECHNICIAN: technicianMenu,
  CUSTOMER: customerMenu,
};

const PROFILE_PATH_BY_ROLE: Record<UserRole, string> = {
  ADMIN: ADMIN_ROUTES.profile,
  TECHNICIAN: TECHNICIAN_ROUTES.profile,
  CUSTOMER: CUSTOMER_ROUTES.profile,
};

// role অনুযায়ী sidebar menu
export function getMenuByRole(role: UserRole): SidebarItems {
  return MENU_BY_ROLE[role] ?? [];
}

export function getProfilePath(role: UserRole): string {
  return PROFILE_PATH_BY_ROLE[role];
}
