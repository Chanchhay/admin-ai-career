import { LoginForm } from "@/components/auth/LoginForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";

export default function LoginPage() {
  return (
    <PublicShell>
      <AuthShell
        title="Login"
        description="Login your account in a seconds. This is a static UI because the current OpenAPI does not expose a login endpoint."
      >
        <LoginForm />
      </AuthShell>
      <PublicFooter />
    </PublicShell>
  );
}
