import AuthSplitLayout from "@/components/auth/auth-split-layout";
import LoginForm from "@/components/form/login-form";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Login",
  description: "Sign in to your account or try a one-click demo login.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <AuthSplitLayout image="/fsm.jpg">
      <LoginForm />
    </AuthSplitLayout>
  );
}
