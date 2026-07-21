import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { PageIntro, PlainCard } from "@/components/shared/ApiCards";

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
              <input className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3" />
            </label>
            <label className="block text-sm font-medium text-heading">
              Password
              <input
                type="password"
                className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3"
              />
            </label>
            <button
              type="button"
              className="h-10 w-full rounded-md bg-brand text-sm font-semibold text-white"
            >
              Continue
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Need an account?{" "}
            <Link href="/register" className="font-semibold text-brand">
              Register
            </Link>
          </p>
        </PlainCard>
      </main>
    </PublicShell>
  );
}
