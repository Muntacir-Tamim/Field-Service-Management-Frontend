"use client";

import { ShieldCheckIcon, UserIcon, WrenchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { DEMO_ACCOUNTS } from "@/constants/demo-accounts.constant";
import { useLogin } from "@/hooks";
import { getDashboardPath } from "@/lib/auth-redirect";
import { getErrorMessage } from "@/utils";
import type { UserRole } from "@/types";

const ICONS: Record<UserRole, typeof UserIcon> = {
  ADMIN: ShieldCheckIcon,
  CUSTOMER: UserIcon,
  TECHNICIAN: WrenchIcon,
};

/** One-click demo login: a button for each of the 3 roles. */
export default function DemoLogin() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);

  const handleDemoLogin = (role: UserRole, email: string, password: string) => {
    setActiveRole(role);
    login(
      { email, password },
      {
        onSuccess: (res) => {
          toast.add({
            title: "Demo login successful",
            description: `Signed in as ${role.toLowerCase()}`,
            type: "success",
          });
          router.replace(getDashboardPath(res.data.role));
        },
        onError: (err) => {
          setActiveRole(null);
          toast.add({
            title: "Demo login failed",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div
      className="grid grid-cols-1 gap-2 sm:grid-cols-3"
      role="group"
      aria-label="Demo login"
    >
      {DEMO_ACCOUNTS.map(({ role, label, description, email, password }) => {
        const Icon = ICONS[role];
        const loading = isPending && activeRole === role;

        return (
          <Button
            key={role}
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => handleDemoLogin(role, email, password)}
            aria-label={`Demo login as ${label}: ${description}`}
            title={description}
            className="h-auto flex-col gap-1 py-3"
          >
            {loading ? <Spinner /> : <Icon />}
            <span className="text-sm font-medium">{label}</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              Demo Login
            </span>
          </Button>
        );
      })}
    </div>
  );
}
