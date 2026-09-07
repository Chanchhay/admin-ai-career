"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, ShieldAlert, X } from "lucide-react";
import {
  PageHeadingProvider,
  usePageHeading,
} from "@/components/layout/PageHeader";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { BrandLogo, BrandMark } from "@/components/shared/BrandLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { adminNavigation, type NavigationItem } from "@/lib/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSidebarExpanded } from "@/store/uiSlice";
import { cn } from "@/lib/utils";
import { resolveFileUrl } from "@/lib/file-url";
import { isStaff } from "@/lib/roles";
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

const RAIL_STORAGE_KEY = "admin.sidebarExpanded";

function Frame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const heading = usePageHeading();
  const active = adminNavigation.find((link) => isActive(pathname, link.href));
  const title = heading?.title ?? active?.label ?? "Admin";

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  // A route change means a link was just followed — close the drawer behind it.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const dispatch = useAppDispatch();
  const expanded = useAppSelector((state) => state.ui.sidebarExpanded);

  // Read once on mount rather than in the initial state: the server has no
  // localStorage, and seeding from it directly would make the first client
  // render disagree with the HTML it is hydrating.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(RAIL_STORAGE_KEY) === "true") {
        dispatch(setSidebarExpanded(true));
      }
    } catch {
      // Private mode, or storage switched off. The rail just starts collapsed.
    }
  }, [dispatch]);

  const toggleRail = () => {
    const next = !expanded;
    dispatch(setSidebarExpanded(next));
    try {
      window.localStorage.setItem(RAIL_STORAGE_KEY, String(next));
    } catch {
      // Not worth failing the interaction over; it just will not persist.
    }
  };

  return (
    /*
     * The frame owns the viewport height and never scrolls itself: the rail
     * stays exactly one screen tall however long a page gets, and the panel's
     * <main> is the only scroller, which leaves the top bar pinned above it.
     */
    <div className="ws-shell flex h-dvh gap-3 overflow-hidden bg-ws-canvas p-0 text-ws-fg lg:p-3">
      <Rail pathname={pathname} expanded={expanded} onToggle={toggleRail} />

      <div className="ws-panel relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-none lg:rounded-3xl">
        <TopBar
          title={title}
          mobileNavOpen={mobileNavOpen}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        {/*
          * A column rather than a block, and the page wrapper is given the
          * full height of it: a page that wants to reach the bottom of the
          * viewport — a table with its footer pinned under it — can then just
          * claim `flex-1`, while shorter pages sit at their natural height as
          * before.
          */}
        <main className="ws-scroll flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-4 lg:px-7 lg:pt-6">
          <div
            key={pathname}
            className="flex min-h-full flex-1 flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out max-lg:min-w-0"
          >
            <StaffRoleNotice />
            {children}

            {/*
              * The end-of-page space, as a box rather than as padding.
              *
              * Padding on the scroller — and on this wrapper inside it — is
              * dropped from the scrollable area here, which leaves the last
              * card flush against the panel's edge with nothing after it. A
              * real element cannot be dropped: it is a flex sibling that never
              * shrinks, so it holds its height whether the page is short or
              * scrolls for miles.
              */}
            <div aria-hidden="true" className="h-[calc(1.5rem+env(safe-area-inset-bottom))] shrink-0 lg:h-10" />
          </div>
        </main>
      </div>

      <MobileNavDrawer
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        pathname={pathname}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- rail --- */

function Rail({
  pathname,
  expanded,
  onToggle,
}: {
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      aria-label="Console navigation"
      className={cn(
        "ws-panel hidden h-full shrink-0 flex-col rounded-3xl py-4 transition-[width] duration-200 ease-out lg:flex",
        expanded ? "w-56 px-3" : "w-16 items-center",
      )}
    >
      <div
        className={cn(
          "flex items-center",
          expanded ? "w-full gap-2" : "flex-col gap-2",
        )}
      >
        {/* The lock-up when its wordmark has room to be read, the mark alone
            when it does not — never the lock-up shrunk into a 36px square. */}
        {expanded ? (
          <BrandLogo height={28} priority className="flex-1" />
        ) : (
          <BrandMark height={30} priority />
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-label={expanded ? "Collapse the sidebar" : "Expand the sidebar"}
          aria-expanded={expanded}
          className="group relative flex size-9 shrink-0 items-center justify-center rounded-xl text-ws-faint transition-colors hover:bg-ws-card hover:text-ws-fg"
        >
          {expanded ? (
            <PanelLeftClose aria-hidden="true" className="size-4.5" />
          ) : (
            <PanelLeftOpen aria-hidden="true" className="size-4.5" />
          )}
          {expanded ? null : <Tooltip>Expand the sidebar</Tooltip>}
        </button>
      </div>

      {/*
        * Scrolling is opt-in by viewport height: `overflow-y` also clips the
        * horizontal axis, which would eat the hover labels, so the rail only
        * becomes a scroller on screens too short to hold all eleven icons.
        */}
      <nav
        className={cn(
          "ws-scroll mt-5 flex min-h-0 flex-col gap-0.5 [@media(max-height:48rem)]:overflow-y-auto",
          expanded ? "w-full" : "items-center",
        )}
      >
        {adminNavigation.map((link) => (
          <RailLink
            key={link.href}
            link={link}
            pathname={pathname}
            expanded={expanded}
          />
        ))}
      </nav>

      <form
        action="/logout"
        method="post"
        className={cn("mt-auto pt-3", expanded && "w-full")}
      >
        <button
          type="submit"
          aria-label="Sign out"
          className={cn(
            "group relative flex h-10 items-center rounded-xl text-ws-faint transition-colors hover:bg-ws-card hover:text-ws-fg",
            expanded ? "w-full gap-3 px-3" : "w-10 justify-center",
          )}
        >
          <LogOut aria-hidden="true" className="size-5 shrink-0" />
          {expanded ? (
            <span className="truncate text-sm font-medium">Sign out</span>
          ) : (
            <Tooltip>Sign out</Tooltip>
          )}
        </button>
      </form>
    </aside>
  );
}

function RailLink({
  link,
  pathname,
  expanded,
}: {
  link: NavigationItem;
  pathname: string;
  expanded: boolean;
}) {
  const active = isActive(pathname, link.href);

  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-10 items-center rounded-xl transition-colors",
        expanded ? "w-full gap-3 px-3" : "w-10 justify-center",
        active
          ? "bg-chip-solid text-chip-solid-fg"
          : "text-ws-faint hover:bg-ws-card hover:text-ws-fg",
      )}
    >
      <link.icon aria-hidden="true" className="size-5 shrink-0" />
      {expanded ? (
        <span className="truncate text-sm font-medium">{link.label}</span>
      ) : (
        /* The label is the tooltip only while there is no room for it inline. */
        <Tooltip>{link.label}</Tooltip>
      )}
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

function TopBar({
  title,
  mobileNavOpen,
  onOpenMobileNav,
}: {
  title: string;
  mobileNavOpen: boolean;
  onOpenMobileNav: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex shrink-0 items-center gap-3 border-b border-ws-line/60 bg-ws-panel px-4 py-3 lg:px-7 lg:py-3.5">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation menu"
        aria-expanded={mobileNavOpen}
        className="-ml-1.5 flex size-9 shrink-0 items-center justify-center rounded-xl text-ws-faint transition-colors hover:bg-ws-card hover:text-ws-fg lg:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>

      <h1 className="min-w-0 truncate text-xl font-semibold tracking-tight max-sm:text-lg">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-2 max-lg:shrink-0 max-sm:gap-1">
        {/*
          * The console's own route prefixes. The inbox is shared with the
          * candidate and recruiter app, so notifications aimed at those roles
          * render as text rather than as links this app cannot serve. Role
          * targeting means the two sets never actually collide in one inbox.
          */}
        <NotificationBell pathPrefixes={[
            "/companies",
            "/applications",
            "/interviews",
            "/users",
            "/messages",
            "/finance",
          ]} />
        <ThemeToggle className="size-9 rounded-full bg-ws-card text-ws-muted hover:bg-ws-card-hover hover:text-ws-fg" />
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
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-chip-solid bg-cover bg-center text-xs font-bold text-chip-solid-fg ring-2 ring-ws-line"
      style={avatar ? { backgroundImage: `url("${avatar}")` } : undefined}
    >
      {avatar ? <span className="sr-only">{name}</span> : initials(name)}
    </span>
  );
}

/* --------------------------------------------------------- role notice --- */

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
  if (isStaff(user.roles)) return null;

  return (
    <div
      role="status"
      className="mb-4 flex items-start gap-2.5 rounded-xl bg-chip-alert px-4 py-3 text-sm leading-6 text-chip-alert-fg"
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

/* -------------------------------------------------------- mobile drawer --- */

/**
 * The rail's small-screen counterpart: the icon strip doesn't fit next to the
 * page, so it lives behind the hamburger button in the top bar instead,
 * sliding in from the left edge it's anchored to.
 */
function MobileNavDrawer({
  open,
  onOpenChange,
  pathname,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 lg:hidden" />

        <DialogPrimitive.Popup
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-64 max-w-[80vw] flex-col gap-1 border-r border-ws-line bg-ws-panel p-3 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-(--shadow-dropdown) outline-none lg:hidden",
            "transition-transform data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full",
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            Console navigation
          </DialogPrimitive.Title>

          <div className="mb-2 flex items-center justify-between px-1">
            <BrandLogo height={28} priority />
            <DialogPrimitive.Close
              aria-label="Close navigation menu"
              className="flex size-9 shrink-0 items-center justify-center rounded-xl text-ws-faint transition-colors hover:bg-ws-card hover:text-ws-fg"
            >
              <X aria-hidden="true" className="size-4.5" />
            </DialogPrimitive.Close>
          </div>

          <nav aria-label="Console navigation" className="ws-scroll flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
            {adminNavigation.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-10 w-full shrink-0 items-center gap-3 rounded-xl px-3 transition-colors",
                    active
                      ? "bg-chip-solid text-chip-solid-fg"
                      : "text-ws-faint hover:bg-ws-card hover:text-ws-fg",
                  )}
                >
                  <link.icon aria-hidden="true" className="size-5 shrink-0" />
                  <span className="truncate text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <form action="/logout" method="post" className="pt-2">
            <button
              type="submit"
              className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-ws-faint transition-colors hover:bg-ws-card hover:text-ws-fg"
            >
              <LogOut aria-hidden="true" className="size-5 shrink-0" />
              <span className="truncate text-sm font-medium">Sign out</span>
            </button>
          </form>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
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
