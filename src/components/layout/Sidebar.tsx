"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV, SECONDARY_NAV, type NavItem } from "./nav-items";


type SidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

function isActive(pathname: string, href: string): boolean {
  // Dashboard must match exactly, or it lights up on every route.
  if (href === "/") return pathname === "/";

  // Otherwise match by the first path segment:
  // "/jobs/new" -> segment "/jobs" -> lights up the "Jobs" item ("/jobs/new").
  const itemSegment = "/" + href.split("/")[1];
  const currentSegment = "/" + pathname.split("/")[1];
  return currentSegment === itemSegment;
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
        active
          ? "bg-white font-semibold text-heading shadow-sm"
          : "font-medium text-slate-500 hover:bg-white/60 hover:text-heading"
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "size-4.5 shrink-0 transition-colors duration-200",
          active ? "text-brand" : "text-slate-400 group-hover:text-slate-600"
        )}
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex h-full flex-col gap-8 px-3 py-6", className)}>
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-3"
        aria-label="TalentPulse home"
      >
        <span className="flex size-9 items-center justify-center rounded-lg bg-brand-tint">
          <Rocket aria-hidden="true" className="size-4.5 text-brand" />
        </span>
        <span className="text-lg font-bold tracking-tight text-heading">
          Talent<span className="text-brand">Pulse</span>
        </span>
      </Link>

      <nav aria-label="Main navigation" className="flex flex-1 flex-col">
        <ul className="flex flex-col gap-1">
          {PRIMARY_NAV.map((item) => (
            <li key={item.href}>
              <NavLink
                item={item}
                active={isActive(pathname, item.href)}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>

        <div className="flex-1" />

        <Separator className="my-4 bg-slate-300/50" />

        <ul className="flex flex-col gap-1">
          {SECONDARY_NAV.map((item) => (
            <li key={item.href}>
              <NavLink
                item={item}
                active={isActive(pathname, item.href)}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}