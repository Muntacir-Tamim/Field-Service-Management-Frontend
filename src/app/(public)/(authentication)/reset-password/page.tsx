import { Suspense } from "react";
import AuthSplitLayout from "@/components/auth/auth-split-layout";
import ResetPasswordForm from "@/components/form/reset-password-form";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Reset password",
  description: "Choose a new password for your account.",
  path: "/reset-password",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout image="/login.jpg">
      <Suspense fallback={<p>Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
