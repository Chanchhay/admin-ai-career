import {
  Bell,
  Briefcase,
  Building2,
  FileText,
  FolderKanban,
  LayoutGrid,
  Search,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
};

export const publicNavigation: NavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Find Jobs" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export const jobSeekerNavigation: Required<NavigationItem>[] = [
  { href: "/job-seeker/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/jobs", label: "Find Jobs", icon: Search },
  { href: "/job-seeker/profile", label: "My Profile", icon: UserRound },
  { href: "/job-seeker/resumes", label: "Resumes", icon: FileText },
  { href: "/job-seeker/portfolios", label: "Portfolios", icon: FolderKanban },
  { href: "/job-seeker/applications", label: "Applications", icon: Briefcase },
  { href: "/job-seeker/interviews", label: "AI Interviews", icon: Bell },
];

export const recruiterNavigation: Required<NavigationItem>[] = [
  { href: "/recruiter/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/recruiter/company", label: "Company", icon: Building2 },
  { href: "/recruiter/jobs", label: "Jobs", icon: Briefcase },
  { href: "/recruiter/talent", label: "Talent Discovery", icon: Search },
  {
    href: "/recruiter/forwarded-candidates",
    label: "Forwarded Candidates",
    icon: UsersRound,
  },
  { href: "/recruiter/profile", label: "Recruiter Profile", icon: UserRound },
];
