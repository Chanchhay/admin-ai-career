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
  description?: string;
};

/** A workspace nav entry: always has an icon, plus a subtitle for the page header. */
export type RoleNavigationItem = NavigationItem & { icon: LucideIcon };

export const publicNavigation: NavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Find Jobs" },
];

export const jobSeekerNavigation: RoleNavigationItem[] = [
  {
    href: "/job-seeker/dashboard",
    label: "Dashboard",
    icon: LayoutGrid,
    description: "An overview of your profile, applications, and interviews.",
  },
  {
    href: "/jobs",
    label: "Find Jobs",
    icon: Search,
    description: "Browse published roles and apply with a saved resume.",
  },
  {
    href: "/job-seeker/profile",
    label: "My Profile",
    icon: UserRound,
    description: "Manage your personal details and public visibility.",
  },
  {
    href: "/job-seeker/resumes",
    label: "Resumes",
    icon: FileText,
    description: "Create resumes, set a default, and control publication.",
  },
  {
    href: "/job-seeker/portfolios",
    label: "Portfolios",
    icon: FolderKanban,
    description: "Showcase the projects recruiters can discover.",
  },
  {
    href: "/job-seeker/applications",
    label: "Applications",
    icon: Briefcase,
    description: "Track every role you have applied to.",
  },
  {
    href: "/job-seeker/interviews",
    label: "AI Interviews",
    icon: Bell,
    description: "Practice sessions and their scored results.",
  },
];

export const recruiterNavigation: RoleNavigationItem[] = [
  {
    href: "/recruiter/dashboard",
    label: "Dashboard",
    icon: LayoutGrid,
    description: "An overview of your company, jobs, and candidates.",
  },
  {
    href: "/recruiter/company",
    label: "Company",
    icon: Building2,
    description: "Manage company details, documents, and verification.",
  },
  {
    href: "/recruiter/jobs",
    label: "Jobs",
    icon: Briefcase,
    description: "Draft, publish, pause, and close your job posts.",
  },
  {
    href: "/recruiter/talent",
    label: "Talent Discovery",
    icon: Search,
    description: "Search public candidate profiles and resumes.",
  },
  {
    href: "/recruiter/forwarded-candidates",
    label: "Forwarded Candidates",
    icon: UsersRound,
    description: "Applications a moderator has forwarded to you.",
  },
  {
    href: "/recruiter/profile",
    label: "Recruiter Profile",
    icon: UserRound,
    description: "Manage the personal details of the business owner.",
  },
];
