import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { ROLES } from "@/constants";

export default function TechnicianLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard roles={[ROLES.TECHNICIAN]}>
      <DashboardShell role={ROLES.TECHNICIAN}>{children}</DashboardShell>
    </RoleGuard>
  );
}
