import {
  BadgeCheck,
  Briefcase,
  CircleUser,
  Compass,
  Kanban,
  LayoutGrid,
  Star,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "Jobs", href: "/jobs/new", icon: Briefcase },
  { label: "Discovery", href: "/discovery/new", icon: Compass },
  { label: "ATS Board", href: "/ats", icon: Kanban },
  { label: "Watchlist", href: "/watchlist", icon: Star },
];

export const SECONDARY_NAV: NavItem[] = [
  { label: "Profile", href: "/profile", icon: CircleUser },
  { label: "Verification", href: "/verification", icon: BadgeCheck },
];