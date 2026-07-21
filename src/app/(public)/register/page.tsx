import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";

export default function RegisterPage() {
  return (
    <PublicShell>
      <AuthShell
        title="Create Account"
        description="Choose your account type and complete the fields defined by RegisterRequest."
        className="lg:grid-cols-[minmax(0,0.82fr)_minmax(520px,1fr)]"
      >
        <RegisterForm />
      </AuthShell>
      <PublicFooter />
    </PublicShell>
  );
}
