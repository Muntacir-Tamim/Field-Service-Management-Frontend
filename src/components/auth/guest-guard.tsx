"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetMe } from "@/hooks";
import { getDashboardPath } from "@/lib/auth-redirect";
import AuthLoading from "./auth-loading";

export default function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending } = useGetMe();

  const user = data?.data;

  useEffect(() => {
    if (user) {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, router]);

  if (isPending) {
    return <AuthLoading label="Loading..." />;
  }

  if (user) {
    return <AuthLoading label="Redirecting..." />;
  }

  return <>{children}</>;
}
