import { Suspense } from "react";
import AuthSplitLayout from "@/components/auth/auth-split-layout";
import VerifyAccountForm from "@/components/form/verify-account-form";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Verify account",
  description: "Enter the code we emailed you to verify your account.",
  path: "/register/verify-account",
  noIndex: true,
});

export default function VerifyAccountPage() {
  return (
    <AuthSplitLayout image="/fsm.jpg">
      <Suspense fallback={<p>Loading...</p>}>
        <VerifyAccountForm mode="customer" />
      </Suspense>
    </AuthSplitLayout>
  );
}
