import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { PageIntro, PlainCard } from "@/components/shared/ApiCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const fields = [
  "username",
  "email",
  "firstName",
  "lastName",
  "phoneNumber",
  "password",
  "confirmPassword",
];

export default function RegisterPage() {
  return (
    <PublicShell>
      <main className="mx-auto max-w-2xl px-4 py-12">
        <PageIntro
          eyebrow="POST /api/v1/auth/register"
          title="Create an account"
          description="RegisterRequest supports SEEKER and RECRUITER roles. This static form mirrors the OpenAPI fields without backend integration."
        />
        <PlainCard>
          <form className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-heading">
              Role
              <select className="mt-1 h-11 w-full rounded-md border border-input bg-surface px-3 text-sm">
                <option value="SEEKER">SEEKER</option>
                <option value="RECRUITER">RECRUITER</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-heading">
              Gender
              <select className="mt-1 h-11 w-full rounded-md border border-input bg-surface px-3 text-sm">
                <option value="UNSPECIFIED">UNSPECIFIED</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </label>
            {fields.map((field) => (
              <label key={field} className="block text-sm font-medium text-heading">
                {field}
                <Input
                  type={field.toLowerCase().includes("password") ? "password" : "text"}
                  className="mt-1"
                />
              </label>
            ))}
            <Button
              type="button"
              className="sm:col-span-2"
            >
              Create account
            </Button>
          </form>
        </PlainCard>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}
