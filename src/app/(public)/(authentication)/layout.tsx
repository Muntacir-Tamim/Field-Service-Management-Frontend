import { type ReactNode, Suspense } from "react";
import AuthLoading from "@/components/auth/auth-loading";
import GuestGuard from "@/components/auth/guest-guard";

export default function AuthenticationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<AuthLoading label="Loading..." />}>
      <GuestGuard>{children}</GuestGuard>
    </Suspense>
  );
}
