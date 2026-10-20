import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { ROLES } from "@/constants";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={[ROLES.ADMIN]}>
      <DashboardShell role={ROLES.ADMIN}>{children}</DashboardShell>
    </RoleGuard>
  );
}
