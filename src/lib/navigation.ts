import {
  Bell,
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  FolderKanban,
  LayoutGrid,
  Search,
  ShieldCheck,
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
    /*
     * The in-workspace explorer, not the public /jobs page: a signed-in seeker
     * applies and runs AI interviews here without leaving the shell.
     */
    href: "/job-seeker/jobs",
    label: "Find Jobs",
    icon: Search,
    description: "Browse published roles, apply, and practise AI interviews.",
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

export const adminNavigation: RoleNavigationItem[] = [
  {
    href: "/admin/dashboard",
    label: "Admin Dashboard",
    icon: LayoutGrid,
    description: "Monitor moderation health and trust signals at a glance.",
  },
  {
    href: "/admin/reviews",
    label: "Verification Reviews",
    icon: ShieldCheck,
    description: "Review pending company applications and approve or reject them.",
  },
  {
    href: "/admin/approvals",
    label: "Approvals",
    icon: CheckCircle2,
    description: "Track successfully approved companies and their verification state.",
  },
  {
    href: "/admin/history",
    label: "Moderation History",
    icon: FileText,
    description: "Review past moderator decisions and recent trust actions.",
  },
];
