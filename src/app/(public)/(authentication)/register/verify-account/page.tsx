import { Suspense } from "react";
import AuthSplitLayout from "@/components/auth/auth-split-layout";
import VerifyAccountForm from "@/components/form/verify-account-form";

export default function VerifyAccountPage() {
  return (
    <AuthSplitLayout image="/fsm.jpg">
      <Suspense fallback={<p>Loading...</p>}>
        <VerifyAccountForm mode="customer" />
      </Suspense>
    </AuthSplitLayout>
  );
}
