import { type ReactNode, Suspense } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import PageSkeleton from "@/components/common/page-skeleton";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      {/* URL-synced filters use useSearchParams, which needs a Suspense boundary */}
      <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
    </AuthGuard>
  );
}
