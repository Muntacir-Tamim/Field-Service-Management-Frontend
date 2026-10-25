import { Suspense } from "react";
import AuthSplitLayout from "@/components/auth/auth-split-layout";
import VerifyAccountForm from "@/components/form/verify-account-form";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Verify application",
  description: "Enter the code we emailed you to confirm your application.",
  path: "/apply/verify-account",
  noIndex: true,
});

export default function TechnicianVerifyAccountPage() {
  return (
    <AuthSplitLayout image="/register.jpg">
      <Suspense fallback={<p>Loading...</p>}>
        <VerifyAccountForm mode="technician" />
      </Suspense>
    </AuthSplitLayout>
  );
}
