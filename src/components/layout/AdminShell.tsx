"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ChevronRight, LogOut, ShieldAlert, Sparkles } from "lucide-react";
import {
  PageHeadingProvider,
  usePageHeading,
} from "@/components/layout/PageHeader";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { adminNavigation, type NavigationItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { resolveFileUrl } from "@/lib/file-url";
import { useGetCurrentUserQuery, useGetSessionQuery } from "@/services/authApi";

/**
 * The console frame: an icon rail beside a single rounded panel. Every page in
 * this app lives inside it, so it is mounted once by the root layout rather
 * than by a per-section layout.
 *
 * Sign-out is a form post to the gateway's `/logout`, not a Next.js route — a
 * plain form action so `basePath` leaves the URL alone.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <PageHeadingProvider>
      <Frame>{children}</Frame>
    </PageHeadingProvider>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const heading = usePageHeading();
  const active = adminNavigation.find((link) => isActive(pathname, link.href));
  const title = heading?.title ?? active?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-ws-canvas p-0 text-ws-fg lg:p-4">
      <div className="mx-auto flex min-h-screen max-w-[1720px] gap-4 lg:min-h-[calc(100vh-2rem)]">
      <Rail pathname={pathname} />

      <div className="ws-panel relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-none lg:rounded-[30px]">
        <TopBar title={title} />

        <main className="ws-scroll flex-1 overflow-y-auto px-4 pb-28 pt-6 lg:px-8 lg:pb-8">
          <div
            key={pathname}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
          >
            <StaffRoleNotice />
            {children}
          </div>
        </main>
      </div>

      <MobileDock pathname={pathname} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- rail --- */

function Rail({ pathname }: { pathname: string }) {
  return (
    <aside
      aria-label="Console navigation"
      className="ws-panel hidden w-64 shrink-0 flex-col rounded-[30px] p-3 lg:flex"
    >
      <Link href="/" className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-ws-card">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-sm shadow-primary/25">A</span>
        <span className="min-w-0"><span className="block text-sm font-bold tracking-tight text-ws-fg">AI Career</span><span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-ws-faint">Admin workspace</span></span>
      </Link>

      <p className="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ws-faint">Workspace</p>
      <nav className="flex w-full flex-col gap-1">
        {adminNavigation.map((link) => (
          <RailLink key={link.href} link={link} pathname={pathname} />
        ))}
      </nav>

      <form action="/logout" method="post" className="mt-auto border-t border-ws-line pt-3">
        <button
          type="submit"
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-ws-muted transition-colors hover:bg-ws-card hover:text-ws-fg"
        >
          <LogOut aria-hidden="true" className="size-5" />
          Sign out
        </button>
      </form>
    </aside>
  );
}

function RailLink({
  link,
  pathname,
}: {
  link: NavigationItem;
  pathname: string;
}) {
  const active = isActive(pathname, link.href);

  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
        active
          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
          : "text-ws-muted hover:bg-ws-card hover:text-ws-fg",
      )}
    >
      <link.icon aria-hidden="true" className="size-[18px] shrink-0" />
      <span className="min-w-0 flex-1 text-left">{link.label}</span>
      {active ? <ChevronRight aria-hidden="true" className="size-4" /> : null}
    </Link>
  );
}

/* -------------------------------------------------------------- top bar --- */

function TopBar({ title }: { title: string }) {
  return (
    <header className="flex items-center gap-3 border-b border-ws-line px-4 py-4 lg:px-8 lg:py-5">
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ws-faint"><Sparkles aria-hidden="true" className="size-3" />Administration</div>
        <h1 className="truncate text-xl font-bold tracking-tight lg:text-2xl">{title}</h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle className="size-10 rounded-full bg-ws-card text-ws-muted hover:bg-ws-card-hover hover:text-ws-fg" />
        <Account />
      </div>
    </header>
  );
}

function Account() {
  const { data: session } = useGetSessionQuery();
  const { data: user } = useGetCurrentUserQuery(undefined, {
    skip: !session?.authenticated,
  });

  if (!session?.authenticated) return null;

  const name = user?.fullName || session.username || session.email || "Account";
  const avatar = resolveFileUrl(user?.avatarUrl);

  return (
    <span
      title={name}
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 bg-cover bg-center text-xs font-bold text-primary ring-2 ring-ws-line"
      style={avatar ? { backgroundImage: `url("${avatar}")` } : undefined}
    >
      {avatar ? <span className="sr-only">{name}</span> : initials(name)}
    </span>
  );
}

/* --------------------------------------------------------- role notice --- */

/** Realm roles the backend's SecurityConfig admits to every console path. */
const STAFF_ROLES = ["MODERATOR", "SUPER_ADMIN"];

/**
 * The backend guards `/moderator/**` and `/admin/**` with `hasRole(MODERATOR)`,
 * which `SUPER_ADMIN` clears through its role hierarchy. An account with
 * neither gets a 403 from every screen here, so this says why once at the top
 * rather than leaving six identical error states to explain it.
 *
 * Advisory only — it mirrors a rule it does not enforce. The 403 is what
 * actually stops the call.
 */
function StaffRoleNotice() {
  const { data: session } = useGetSessionQuery();
  const { data: user, isSuccess } = useGetCurrentUserQuery(undefined, {
    skip: !session?.authenticated,
  });

  // Silent until the roles are known: flashing a warning during the first
  // render would accuse every legitimate operator on the way in.
  if (!isSuccess) return null;
  if (user.roles.some((role) => STAFF_ROLES.includes(role))) return null;

  return (
    <div
      role="status"
      className="mb-5 flex items-start gap-3 rounded-[22px] bg-chip-alert px-4 py-3 text-sm text-chip-alert-fg"
    >
      <ShieldAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p>
        This account has neither <strong>MODERATOR</strong> nor{" "}
        <strong>SUPER_ADMIN</strong>, so the API will refuse every screen in this
        console. Ask for the role in Keycloak, then sign out and back in — roles
        are read from the token issued at sign-in.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------- mobile dock --- */

function MobileDock({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Console navigation"
      className="ws-scroll fixed inset-x-3 bottom-3 z-40 flex gap-1 overflow-x-auto rounded-full bg-ws-card/95 p-1.5 shadow-(--shadow-dropdown) backdrop-blur lg:hidden"
    >
      {adminNavigation.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-label={link.label}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-full transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-ws-faint hover:text-ws-fg",
            )}
          >
            <link.icon aria-hidden="true" className="size-5" />
          </Link>
        );
      })}
    </nav>
  );
}

/* -------------------------------------------------------------- helpers --- */

function initials(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return letters || "U";
}

/**
 * `usePathname` reports the path without `basePath`, so these compare against
 * the hrefs in {@link adminNavigation} directly. Overview is the index route
 * and would otherwise match everything, so it alone is compared exactly.
 */
function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
