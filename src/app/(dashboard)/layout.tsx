import type { ReactNode } from "react";
import AuthGuard from "@/components/auth/auth-guard";

// logged-in না হলে /login এ পাঠায়; role check হয় নিচের layout গুলোতে
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
