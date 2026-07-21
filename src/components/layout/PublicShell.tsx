"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { publicNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-heading">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center" aria-label="AI Career home">
            <Image
              src="/figma/brand-logo.png"
              alt="AI Career"
              width={155}
              height={84}
              className="h-14 w-28 object-contain object-left"
              priority
            />
          </Link>

          <nav
            aria-label="Public navigation"
            className="hidden items-center gap-7 md:flex"
          >
            {publicNavigation.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "text-sm font-medium text-body transition-colors hover:text-brand",
                  pathname === link.href && "text-brand",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-semibold text-heading transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              Register
            </Link>
          </div>

          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu aria-hidden="true" />
              <span className="sr-only">Open navigation</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(22rem,calc(100vw-2rem))]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile public navigation" className="grid gap-1 px-4">
                {publicNavigation.map((link) => (
                  <SheetClose key={link.href} render={<Link href={link.href} />}>
                    <span
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm font-medium text-body hover:bg-surface-muted hover:text-heading",
                        pathname === link.href && "bg-surface-muted text-brand",
                      )}
                    >
                      {link.label}
                    </span>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      {children}
    </div>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-body sm:px-6 lg:px-8">
        <p className="font-medium text-heading">AI Career Platform</p>
        <p>Public jobs, seeker workspace, and recruiter hiring tools.</p>
      </div>
    </footer>
  );
}
