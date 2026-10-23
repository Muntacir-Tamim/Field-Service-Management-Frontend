import AuthSplitLayout from "@/components/auth/auth-split-layout";
import RegisterForm from "@/components/form/register-form";

export default function RegisterPage() {
  return (
    <AuthSplitLayout image="/fsm.jpg">
      <RegisterForm />
    </AuthSplitLayout>
  );
}
