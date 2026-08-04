"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Bell,
  Briefcase,
  Menu,
  Search,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { KeycloakLogoutButton } from "@/components/auth/AuthActions";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  PageHeadingProvider,
  usePageHeading,
} from "@/components/layout/PageHeader";
import { authClient } from "@/lib/auth-client";
import { jobSeekerNavigation, recruiterNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useGetCurrentUserQuery } from "@/services/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMobileNavigationOpen } from "@/store/uiSlice";

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
};

type RoleShellProps = {
  role: "job-seeker" | "recruiter";
  title: string;
  links: NavLink[];
  children: ReactNode;
};

/* Nav row height + gap, in px. The carved active tab slides in multiples of the sum. */
const NAV_ROW_HEIGHT = 48;
const NAV_ROW_GAP = 8;

const roleIcon: Record<RoleShellProps["role"], LucideIcon> = {
  "job-seeker": UserRound,
  recruiter: Briefcase,
};

export function RoleShell(props: RoleShellProps) {
  return (
    <PageHeadingProvider>
      <RoleShellFrame {...props} />
    </PageHeadingProvider>
  );
}

function RoleShellFrame({ role, title, links, children }: RoleShellProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const mobileNavigationOpen = useAppSelector(
    (state) => state.ui.mobileNavigationOpen,
  );
  const heading = usePageHeading();
  const activeIndex = links.findIndex((link) =>
    isActivePath(pathname, link.href, role),
  );
  const activeLink = links[activeIndex];
  const pageTitle = heading?.title ?? activeLink?.label ?? title;
  const pageDescription = heading?.description ?? activeLink?.description;

  return (
    <div className="min-h-screen bg-(--shell-canvas) text-heading lg:p-4">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col overflow-hidden rounded-none bg-(--shell-card) shadow-[0_1px_2px_rgba(16,24,40,0.04),0_16px_40px_rgba(16,24,40,0.07)] lg:h-[calc(100vh-2rem)] lg:min-h-0 lg:flex-row lg:rounded-(--shell-radius)">
        <aside className="sidebar-rail hidden w-72 shrink-0 flex-col overflow-y-auto py-7 lg:flex">
          <SidebarContent
            role={role}
            title={title}
            links={links}
            activeIndex={activeIndex}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-(--content-bg) lg:overflow-y-auto">
          <header className="flex h-16 items-center justify-between border-b border-border px-4 lg:hidden">
            <Link href="/" className="flex items-center" aria-label="All apps">
              <Image
                src="/figma/brand-logo.png"
                alt="AI Career"
                width={155}
                height={84}
                className="h-11 w-24 object-contain object-left"
                priority
              />
            </Link>
            <Sheet
              open={mobileNavigationOpen}
              onOpenChange={(open) => dispatch(setMobileNavigationOpen(open))}
            >
              <SheetTrigger render={<Button variant="ghost" size="icon" />}>
                <Menu aria-hidden="true" />
                <span className="sr-only">Open navigation</span>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[min(22rem,calc(100vw-2rem))]"
              >
                <SheetHeader>
                  <SheetTitle>{title}</SheetTitle>
                </SheetHeader>
                <nav
                  aria-label={`${title} mobile navigation`}
                  className="grid gap-1 px-4"
                >
                  {links.map((link) => (
                    <SheetClose
                      key={link.href}
                      render={<Link href={link.href} />}
                    >
                      <span
                        className={cn(
                          "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-body transition-colors hover:bg-surface-muted hover:text-heading",
                          isActivePath(pathname, link.href, role) &&
                            "bg-surface-muted text-heading",
                        )}
                      >
                        <link.icon aria-hidden="true" className="size-4" />
                        {link.label}
                      </span>
                    </SheetClose>
                  ))}
                  <KeycloakLogoutButton
                    variant="ghost"
                    className="w-full justify-start px-3 text-body"
                  />
                </nav>
              </SheetContent>
            </Sheet>
          </header>

          {/* Stays put while the content column scrolls underneath it. */}
          <div className="sticky top-0 z-20 bg-(--content-bg) pb-1">
            <div className="flex items-start justify-between gap-6 px-6 pt-7 lg:px-10 lg:pt-9">
              <h1 className="min-w-0 truncate text-2xl font-bold tracking-tight text-heading lg:text-[32px]">
                {pageTitle}
              </h1>
              <div className="flex shrink-0 items-center gap-2 lg:gap-3">
                <div className="relative hidden md:block">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-fg"
                  />
                  <Input
                    type="search"
                    placeholder="Search"
                    className="h-11 w-56 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                  />
                </div>
                <ThemeToggle className="size-11 rounded-lg border-border hover:border-brand/30" />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Notifications"
                  className="size-11 rounded-lg border-border text-body hover:border-brand/30 hover:bg-brand-tint hover:text-brand"
                >
                  <Bell aria-hidden="true" className="size-5" />
                </Button>
                <AccountChip />
              </div>
            </div>

            {pageDescription ? (
              <p className="px-6 pt-4 text-sm leading-6 text-body lg:px-10">
                {pageDescription}
              </p>
            ) : null}
          </div>

          <main className="flex-1 px-4 pb-6 pt-6 lg:px-10 lg:pb-10 lg:pt-7">
            <div
              key={pathname}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  role,
  title,
  links,
  activeIndex,
}: {
  role: RoleShellProps["role"];
  title: string;
  links: NavLink[];
  activeIndex: number;
}) {
  const AppIcon = roleIcon[role];

  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex h-12 items-center px-5" aria-label="Home">
        <Image
          src="/figma/brand-logo.png"
          alt="AI Career"
          width={155}
          height={84}
          className="h-12 w-28 object-contain object-left"
          priority
        />
      </Link>

      <Link
        href="/"
        className="mt-8 flex items-center gap-3 px-5 py-2 text-sm text-(--sidebar-muted-fg) transition-colors hover:text-(--sidebar-fg)"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        All apps
      </Link>

      <div className="mt-4 flex items-center gap-3 px-5 py-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-brand-tint text-brand">
          <AppIcon aria-hidden="true" className="size-4" />
        </span>
        <span className="truncate text-[15px] font-semibold text-(--sidebar-fg)">
          {title}
        </span>
      </div>

      <div className="relative mt-4">
        {/*
         * A single indicator carries the active-tab shape (and its carved
         * corners) so it slides between rows instead of popping.
         */}
        {activeIndex >= 0 ? (
          <span
            aria-hidden="true"
            className="sidebar-tab-indicator absolute left-3 right-0 top-0 transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{
              height: NAV_ROW_HEIGHT,
              transform: `translateY(${activeIndex * (NAV_ROW_HEIGHT + NAV_ROW_GAP)}px)`,
            }}
          />
        ) : null}

        <nav
          aria-label={`${title} navigation`}
          className="relative flex flex-col"
          style={{ gap: NAV_ROW_GAP }}
        >
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={index === activeIndex ? "page" : undefined}
              style={{ height: NAV_ROW_HEIGHT }}
              className={cn(
                "relative ml-3 flex items-center gap-4 rounded-l-[14px] px-5 text-[15px] font-medium transition-colors duration-200",
                index === activeIndex
                  ? "text-(--sidebar-fg)"
                  : "mr-3 rounded-[14px] text-(--sidebar-muted-fg) hover:bg-white/45 hover:text-(--sidebar-fg)",
              )}
            >
              <link.icon aria-hidden="true" className="size-5 shrink-0" />
              <span className="truncate">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-3 pt-6">
        <KeycloakLogoutButton
          variant="ghost"
          className="w-full justify-start gap-3 rounded-[14px] px-4 text-(--sidebar-muted-fg) hover:bg-white/50 hover:text-(--sidebar-fg)"
        />
      </div>
    </div>
  );
}

function AccountChip() {
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
      className="flex h-11 max-w-52 items-center gap-2.5 rounded-full border border-border bg-surface pl-1.5 pr-4 transition-colors hover:border-brand/40 hover:bg-brand-tint focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      aria-label={`Open ${name}'s profile`}
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-tint bg-cover bg-center text-[11px] font-bold text-brand ring-1 ring-brand/20"
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
      </span>
      <span className="hidden truncate text-sm font-medium text-heading xl:block">
        {name}
      </span>
    </Link>
  );
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "U";
}

function isActivePath(
  pathname: string,
  href: string,
  role: "job-seeker" | "recruiter",
) {
  return href === `/${role}/dashboard`
    ? pathname === href
    : pathname.startsWith(href);
}

export const jobSeekerLinks = [...jobSeekerNavigation] satisfies NavLink[];

export const recruiterLinks = [...recruiterNavigation] satisfies NavLink[];
