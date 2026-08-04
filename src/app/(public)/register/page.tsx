import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";

export default function RegisterPage() {
  return (
    <PublicShell>
      <AuthShell
        title="Create your account"
        description="Choose how you will use the platform, then tell us the essentials to get started."
        className="lg:grid-cols-[minmax(0,.72fr)_minmax(570px,1.28fr)]"
      >
        <RegisterForm />
      </AuthShell>
      <PublicFooter />
    </PublicShell>
  );
}
