import AuthSplitLayout from "@/components/auth/auth-split-layout";
import LoginForm from "@/components/form/login-form";

export default function LoginPage() {
  return (
    <AuthSplitLayout image="/login.jpg">
      <LoginForm />
    </AuthSplitLayout>
  );
}
