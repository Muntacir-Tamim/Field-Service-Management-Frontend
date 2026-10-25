import AuthSplitLayout from "@/components/auth/auth-split-layout";
import RegisterForm from "@/components/form/register-form";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Register",
  description: "Create a customer account to book field services.",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <AuthSplitLayout image="/fsm.jpg">
      <RegisterForm />
    </AuthSplitLayout>
  );
}
