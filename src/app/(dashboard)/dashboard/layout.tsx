import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { ROLES } from "@/constants";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={[ROLES.CUSTOMER]}>
      <DashboardShell role={ROLES.CUSTOMER}>{children}</DashboardShell>
    </RoleGuard>
  );
}
