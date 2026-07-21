"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Bell,
  LogOut,
  Menu,
  Search,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  jobSeekerNavigation,
  recruiterNavigation,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

type RoleShellProps = {
  role: "job-seeker" | "recruiter";
  title: string;
  links: { href: string; label: string; icon: LucideIcon }[];
  children: ReactNode;
};

export function RoleShell({ role, title, links, children }: RoleShellProps) {
  const pathname = usePathname();
  const homeHref = role === "job-seeker" ? "/job-seeker/dashboard" : "/recruiter/dashboard";

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-heading">
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-screen px-2 py-6 lg:block">
          <DashboardNavigation
            title={title}
            links={links}
            pathname={pathname}
            homeHref={homeHref}
          />
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
            <Link href={homeHref} className="flex items-center" aria-label={`${title} home`}>
              <Image
                src="/figma/brand-logo.png"
                alt="AI Career"
                width={155}
                height={84}
                className="h-12 w-24 object-contain object-left"
                priority
              />
            </Link>
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" />}>
                <Menu aria-hidden="true" />
                <span className="sr-only">Open navigation</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-[min(22rem,calc(100vw-2rem))]">
                <SheetHeader>
                  <SheetTitle>{title}</SheetTitle>
                </SheetHeader>
                <nav aria-label={`${title} mobile navigation`} className="grid gap-1 px-4">
                  {links.map((link) => (
                    <SheetClose key={link.href} render={<Link href={link.href} />}>
                      <span
                        className={cn(
                          "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-body hover:bg-surface-muted hover:text-heading",
                          isActivePath(pathname, link.href, role) && "bg-primary-tint text-brand",
                        )}
                      >
                        <link.icon aria-hidden="true" className="size-4" />
                        {link.label}
                      </span>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </header>

          <main className="p-4 lg:py-6 lg:pr-10">
            <div className="min-h-[calc(100vh-48px)] rounded-lg bg-surface p-5 shadow-[var(--shadow-card)] lg:p-8">
              <div className="mb-8 hidden items-center justify-between border-b border-border pb-5 lg:flex">
                <div>
                  <p className="text-sm font-medium text-body">{title}</p>
                  <h1 className="text-2xl font-semibold text-heading">Workspace</h1>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative hidden sm:block">
                    <Search
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-fg"
                    />
                    <input
                      type="search"
                      placeholder="Search"
                      className="h-10 w-64 rounded-md border border-border bg-surface pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                    />
                  </div>
                  <Button variant="outline" size="icon" aria-label="Notifications">
                    <Bell aria-hidden="true" className="size-4" />
                  </Button>
                </div>
              </div>
            {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function DashboardNavigation({
  title,
  links,
  pathname,
  homeHref,
}: {
  title: string;
  links: { href: string; label: string; icon: LucideIcon }[];
  pathname: string;
  homeHref: string;
}) {
  return (
    <div className="flex h-full flex-col">
      <Link href={homeHref} className="flex h-20 items-center px-3" aria-label={`${title} home`}>
        <Image
          src="/figma/brand-logo.png"
          alt="AI Career"
          width={155}
          height={84}
          className="h-16 w-32 object-contain object-left"
          priority
        />
      </Link>
      <p className="mt-12 px-3 text-xs font-bold uppercase text-body/70">
        Main menu
      </p>
      <nav aria-label={`${title} navigation`} className="mt-5 flex flex-col gap-1">
        {links.map((link) => (
          <SidebarLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            active={isActivePath(pathname, link.href, title === "Job seeker" ? "job-seeker" : "recruiter")}
          >
            {link.label}
          </SidebarLink>
        ))}
      </nav>
      <Link
        href="/login"
        className="mt-auto flex h-11 items-center gap-3 rounded-md px-4 text-sm font-medium text-body transition-colors hover:bg-surface/70 hover:text-heading"
      >
        <LogOut aria-hidden="true" className="size-4" />
        Sign out
      </Link>
    </div>
  );
}

function isActivePath(pathname: string, href: string, role: "job-seeker" | "recruiter") {
  return href === `/${role}/dashboard` ? pathname === href : pathname.startsWith(href);
}

function SidebarLink({
  href,
  icon: Icon,
  active,
  children,
}: {
  href: string;
  icon: LucideIcon;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-11 items-center gap-3 rounded-md px-4 text-sm font-medium transition-colors",
        active
          ? "bg-surface text-brand shadow-[inset_3px_0_0_var(--info)]"
          : "text-body hover:bg-surface/70 hover:text-heading",
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <span className="truncate">{children}</span>
    </Link>
  );
}

export const jobSeekerLinks = [
  ...jobSeekerNavigation,
] satisfies { href: string; label: string; icon: LucideIcon }[];

export const recruiterLinks = [
  ...recruiterNavigation,
] satisfies { href: string; label: string; icon: LucideIcon }[];
