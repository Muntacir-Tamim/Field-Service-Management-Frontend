"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetMe } from "@/hooks";
import { getDashboardPath } from "@/lib/auth-redirect";
import AuthLoading from "./auth-loading";

export default function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending } = useGetMe();

  const user = data?.data;
  const reauth = useSearchParams().get("reauth") === "1";

  useEffect(() => {
    if (user && !reauth) {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, reauth, router]);

  if (isPending) {
    return <AuthLoading label="Loading..." />;
  }

  if (user && !reauth) {
    return <AuthLoading label="Redirecting..." />;
  }

  return <>{children}</>;
}
