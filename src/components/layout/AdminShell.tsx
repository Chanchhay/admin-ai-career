"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LogOut, ShieldAlert } from "lucide-react";
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
    <div className="flex min-h-screen gap-3 bg-ws-canvas p-0 text-ws-fg lg:p-3">
      <Rail pathname={pathname} />

      <div className="ws-panel relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-none lg:rounded-[28px]">
        <TopBar title={title} />

        <main className="ws-scroll flex-1 overflow-y-auto px-4 pb-28 pt-2 lg:px-7 lg:pb-8">
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
  );
}

/* ---------------------------------------------------------------- rail --- */

function Rail({ pathname }: { pathname: string }) {
  return (
    <aside
      aria-label="Console navigation"
      className="ws-panel hidden w-17 shrink-0 flex-col items-center rounded-[28px] py-5 lg:flex"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-primary text-lg font-black text-primary-foreground">
        A
      </span>

      <nav className="mt-8 flex flex-col items-center gap-1.5">
        {adminNavigation.map((link) => (
          <RailLink key={link.href} link={link} pathname={pathname} />
        ))}
      </nav>

      <form action="/logout" method="post" className="mt-auto">
        <button
          type="submit"
          aria-label="Sign out"
          className="group relative flex size-11 items-center justify-center rounded-2xl text-ws-faint transition-colors hover:bg-ws-card hover:text-ws-fg"
        >
          <LogOut aria-hidden="true" className="size-5" />
          <Tooltip>Sign out</Tooltip>
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
        "group relative flex size-11 items-center justify-center rounded-2xl transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-ws-faint hover:bg-ws-card hover:text-ws-fg",
      )}
    >
      <link.icon aria-hidden="true" className="size-5" />
      <Tooltip>{link.label}</Tooltip>
    </Link>
  );
}

/** Label shown on hover, so the rail stays an icon strip rather than a menu. */
function Tooltip({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-full z-30 ml-3 hidden whitespace-nowrap rounded-lg bg-ws-card px-2.5 py-1.5 text-xs font-medium text-ws-fg shadow-(--shadow-dropdown) group-hover:block">
      {children}
    </span>
  );
}

/* -------------------------------------------------------------- top bar --- */

function TopBar({ title }: { title: string }) {
  return (
    <header className="flex items-center gap-3 px-4 py-4 lg:px-7 lg:py-5">
      <h1 className="min-w-0 truncate text-lg font-semibold tracking-tight lg:text-xl">
        {title}
      </h1>

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
