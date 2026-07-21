import type { ReactNode } from "react";
import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

export function AuthShell({ title, description, children, className }: AuthShellProps) {
  return (
    <main className="bg-canvas px-4 py-10 sm:px-6 lg:px-8">
      <div
        className={cn(
          "mx-auto grid max-w-6xl overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow-dropdown)] lg:grid-cols-[minmax(0,0.95fr)_minmax(430px,1fr)]",
          className,
        )}
      >
        <section className="relative hidden min-h-[640px] overflow-hidden bg-[#d0e1fb] p-10 lg:flex lg:flex-col lg:justify-between">
          <Link href="/" className="text-2xl font-semibold text-brand">
            ការងារ
          </Link>
          <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center rounded-full bg-white/70">
            <div className="absolute left-4 top-12 flex size-24 items-center justify-center rounded-full bg-[#ff8ea9] text-white shadow-[var(--shadow-card)]">
              <LockKeyhole aria-hidden="true" className="size-10" />
            </div>
            <div className="relative w-64 rounded-[28px] border-4 border-brand bg-white p-6 shadow-[var(--shadow-dropdown)]">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-warning text-heading">
                <ShieldCheck aria-hidden="true" className="size-8" />
              </div>
              <div className="mt-8 space-y-3">
                <div className="h-8 rounded-md bg-canvas" />
                <div className="h-8 rounded-md bg-canvas" />
                <div className="mx-auto h-10 w-28 rounded-md bg-[#f7a9a9]" />
              </div>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-6 text-heading/80">
            Static authentication screens use the approved visual pattern without
            implying a real session.
          </p>
        </section>
        <section className="p-5 sm:p-8 lg:p-12">
          <div className="mx-auto max-w-md">
            <h1 className="text-3xl font-semibold text-brand">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-body">{description}</p>
            <div className="mt-7">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
