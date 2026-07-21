import Link from "next/link";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { PageIntro, PlainCard } from "@/components/shared/ApiCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <PublicShell>
      <main className="mx-auto max-w-md px-4 py-12">
        <PageIntro
          eyebrow="Static login UI"
          title="Login"
          description="The current OpenAPI file exposes registration but no login endpoint, so this is a static login screen only."
        />
        <PlainCard>
          <form className="space-y-4">
            <label className="block text-sm font-medium text-heading">
              Email
              <Input className="mt-1" />
            </label>
            <label className="block text-sm font-medium text-heading">
              Password
              <Input type="password" className="mt-1" />
            </label>
            <Button
              type="button"
              className="w-full"
            >
              Continue
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Need an account?{" "}
            <Link href="/register" className="font-semibold text-brand">
              Register
            </Link>
          </p>
        </PlainCard>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}
