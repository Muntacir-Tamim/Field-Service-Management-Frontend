import type { ReactNode } from "react";
import GuestGuard from "@/components/auth/guest-guard";

export default function AuthenticationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <GuestGuard>{children}</GuestGuard>;
}
