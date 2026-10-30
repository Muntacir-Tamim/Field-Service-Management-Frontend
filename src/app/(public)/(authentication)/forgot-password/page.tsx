import AuthSplitLayout from "@/components/auth/auth-split-layout";
import ForgotPasswordForm from "@/components/form/forgot-password-form";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Forgot password",
  description: "Reset your password with a one-time code.",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout image="/fsm.jpg">
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}
