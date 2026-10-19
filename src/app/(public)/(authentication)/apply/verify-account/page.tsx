import { Suspense } from "react";
import AuthSplitLayout from "@/components/auth/auth-split-layout";
import VerifyAccountForm from "@/components/form/verify-account-form";

export default function TechnicianVerifyAccountPage() {
  return (
    <AuthSplitLayout image="/register.jpg">
      <Suspense fallback={<p>Loading...</p>}>
        <VerifyAccountForm mode="technician" />
      </Suspense>
    </AuthSplitLayout>
  );
}
