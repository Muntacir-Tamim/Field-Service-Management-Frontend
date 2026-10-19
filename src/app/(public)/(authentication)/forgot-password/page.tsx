import AuthSplitLayout from "@/components/auth/auth-split-layout";
import ForgotPasswordForm from "@/components/form/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout image="/login.jpg">
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}
