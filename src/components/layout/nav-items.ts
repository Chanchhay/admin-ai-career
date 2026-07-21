import {
  Briefcase,
  Building2,
  CircleUser,
  LayoutGrid,
  Search,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/recruiter/dashboard", icon: LayoutGrid },
  { label: "Company", href: "/recruiter/company", icon: Building2 },
  { label: "Jobs", href: "/recruiter/jobs", icon: Briefcase },
  { label: "Talent Discovery", href: "/recruiter/talent", icon: Search },
  {
    label: "Forwarded Candidates",
    href: "/recruiter/forwarded-candidates",
    icon: UsersRound,
  },
];

export const SECONDARY_NAV: NavItem[] = [
  { label: "Recruiter Profile", href: "/recruiter/profile", icon: CircleUser },
];
