"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Bell,
  LogOut,
  Plus,
  Search,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  PageHeadingProvider,
  usePageHeading,
} from "@/components/layout/PageHeader";
import { authClient } from "@/lib/auth-client";
import { jobSeekerNavigation, recruiterNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useGetCurrentUserQuery } from "@/services/authApi";

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
};

type Role = "job-seeker" | "recruiter";

type WorkspaceShellProps = {
  role: Role;
  /** Shown next to the back arrow when a page has not published its own title. */
  title: string;
  links: NavLink[];
  children: ReactNode;
};

/** Where the chrome's search, create, and alert controls land per role. */
const quickActions: Record<Role, { search: string; create: string; alerts: string }> = {
  "job-seeker": {
    search: "/job-seeker/jobs",
    create: "/job-seeker/jobs",
    alerts: "/job-seeker/interviews",
  },
  recruiter: {
    search: "/recruiter/talent",
    create: "/recruiter/jobs/new",
    alerts: "/recruiter/forwarded-candidates",
  },
};

/**
 * The workspace frame: an icon rail and a single rounded panel floating on a
 * dark canvas. Deliberately not a dashboard chrome — no bordered header band,
 * no page description column; pages own their own composition inside the panel.
 */
export function WorkspaceShell(props: WorkspaceShellProps) {
  return (
    <PageHeadingProvider>
      <WorkspaceFrame {...props} />
    </PageHeadingProvider>
  );
}

function WorkspaceFrame({ role, title, links, children }: WorkspaceShellProps) {
  const pathname = usePathname();
  const heading = usePageHeading();
  const activeLink = links.find((link) => isActivePath(pathname, link.href));
  const pageTitle = heading?.title ?? activeLink?.label ?? title;

  return (
    <div className="flex min-h-screen gap-3 bg-ws-canvas p-0 text-ws-fg lg:p-3">
      <Rail links={links} pathname={pathname} />

      <div className="ws-panel relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-none lg:rounded-[28px]">
        <TopBar title={pageTitle} role={role} />

        <main className="ws-scroll flex-1 overflow-y-auto px-4 pb-28 pt-2 lg:px-7 lg:pb-8">
          <div
            key={pathname}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
          >
            {children}
          </div>
        </main>
      </div>

      <MobileDock links={links} pathname={pathname} />
    </div>
  );
}

/* ---------------------------------------------------------------- rail --- */

function Rail({ links, pathname }: { links: NavLink[]; pathname: string }) {
  return (
    <aside
      aria-label="Workspace navigation"
      className="ws-panel hidden w-17 shrink-0 flex-col items-center rounded-[28px] py-5 lg:flex"
    >
      <Link
        href="/"
        aria-label="Home"
        className="flex size-10 items-center justify-center rounded-full bg-primary text-lg font-black text-primary-foreground transition-transform hover:scale-105"
      >
        A
      </Link>

      <nav className="mt-8 flex flex-col items-center gap-1.5">
        {links.map((link) => {
          const active = isActivePath(pathname, link.href);
          return (
            <Link
              key={link.href}
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
              {/* Label only on hover: the rail stays an icon strip, not a menu. */}
              <span className="pointer-events-none absolute left-full z-30 ml-3 hidden whitespace-nowrap rounded-lg bg-ws-card px-2.5 py-1.5 text-xs font-medium text-ws-fg shadow-(--shadow-dropdown) group-hover:block">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <SignOutRailButton />
    </aside>
  );
}

function SignOutRailButton() {
  return (
    <form action="/api/auth/keycloak/logout" method="post" className="mt-auto">
      <button
        type="submit"
        aria-label="Sign out"
        className="group relative flex size-11 items-center justify-center rounded-2xl text-ws-faint transition-colors hover:bg-ws-card hover:text-ws-fg"
      >
        <LogOut aria-hidden="true" className="size-5" />
        <span className="pointer-events-none absolute left-full z-30 ml-3 hidden whitespace-nowrap rounded-lg bg-ws-card px-2.5 py-1.5 text-xs font-medium text-ws-fg shadow-(--shadow-dropdown) group-hover:block">
          Sign out
        </span>
      </button>
    </form>
  );
}

/* -------------------------------------------------------------- top bar --- */

function TopBar({ title, role }: { title: string; role: Role }) {
  const actions = quickActions[role];

  return (
    <header className="flex items-center gap-3 px-4 py-4 lg:px-7 lg:py-5">
      <Link
        href="/"
        aria-label="Back to site"
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-ws-muted transition-colors hover:bg-ws-card hover:text-ws-fg"
      >
        <ArrowLeft aria-hidden="true" className="size-4.5" />
      </Link>

      <h1 className="min-w-0 truncate text-lg font-semibold tracking-tight lg:text-xl">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-2">
        <QuickSearch
          href={actions.search}
          placeholder={role === "recruiter" ? "Search talent" : "Search jobs"}
        />

        <Link
          href={actions.create}
          aria-label={role === "recruiter" ? "Post a job" : "Find a new role"}
          className="flex size-10 items-center justify-center rounded-full bg-ws-fg text-ws-panel transition-transform hover:scale-105"
        >
          <Plus aria-hidden="true" className="size-5" />
        </Link>

        <ThemeToggle className="size-10 rounded-full bg-ws-card text-ws-muted hover:bg-ws-card-hover hover:text-ws-fg" />

        <Link
          href={actions.alerts}
          aria-label={role === "recruiter" ? "Forwarded candidates" : "AI interviews"}
          className="hidden size-10 items-center justify-center rounded-full bg-ws-card text-ws-muted transition-colors hover:bg-ws-card-hover hover:text-ws-fg sm:flex"
        >
          <Bell aria-hidden="true" className="size-4.5" />
        </Link>

        <Avatar />
      </div>
    </header>
  );
}

/** Hands the query to the in-workspace explorer rather than any public page. */
function QuickSearch({ href, placeholder }: { href: string; placeholder: string }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const query = keyword.trim();
        router.push(query ? `${href}?q=${encodeURIComponent(query)}` : href);
      }}
      className="hidden items-center gap-2 rounded-full bg-ws-card px-4 py-2.5 text-sm text-ws-muted transition-colors focus-within:bg-ws-card-hover md:flex"
    >
      <Search aria-hidden="true" className="size-4 shrink-0" />
      <input
        type="search"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-40 bg-transparent text-ws-fg outline-none placeholder:text-ws-faint xl:w-56"
      />
    </form>
  );
}

function Avatar() {
  const { data: session } = authClient.useSession();
  const currentUser = useGetCurrentUserQuery(undefined, {
    skip: !session?.user,
  });

  if (!session?.user) return null;

  const name =
    currentUser.data?.fullName || session.user.name || session.user.email;

  return (
    <Link
      href="/profile"
      aria-label={`Open ${name}'s profile`}
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 bg-cover bg-center text-xs font-bold text-primary ring-2 ring-ws-line"
      style={
        session.user.image
          ? { backgroundImage: `url("${session.user.image}")` }
          : undefined
      }
    >
      {session.user.image ? (
        <span className="sr-only">Profile image</span>
      ) : (
        getInitials(name)
      )}
    </Link>
  );
}

/* ---------------------------------------------------------- mobile dock --- */

/**
 * On small screens the rail becomes a floating dock: same icons, still no
 * hamburger menu, so navigation stays one tap away.
 */
function MobileDock({ links, pathname }: { links: NavLink[]; pathname: string }) {
  return (
    <nav
      aria-label="Workspace navigation"
      className="ws-scroll fixed inset-x-3 bottom-3 z-40 flex gap-1 overflow-x-auto rounded-full bg-ws-card/95 p-1.5 shadow-(--shadow-dropdown) backdrop-blur lg:hidden"
    >
      {links.map((link) => {
        const active = isActivePath(pathname, link.href);
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

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "U";
}

function isActivePath(pathname: string, href: string) {
  return href.endsWith("/dashboard")
    ? pathname === href
    : pathname.startsWith(href);
}

/*
 * Re-exported from this client module so the icon components stay on the client
 * side of the boundary — a server layout cannot hand functions to a client one.
 */
export const jobSeekerLinks = [...jobSeekerNavigation] satisfies NavLink[];

export const recruiterLinks = [...recruiterNavigation] satisfies NavLink[];
