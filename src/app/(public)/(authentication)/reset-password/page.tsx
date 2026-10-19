import { Suspense } from "react";
import AuthSplitLayout from "@/components/auth/auth-split-layout";
import ResetPasswordForm from "@/components/form/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout image="/login.jpg">
      <Suspense fallback={<p>Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
