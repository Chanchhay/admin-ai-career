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
  BarChart3,
  Settings,
  HelpCircle,
  Shield,
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
    label: "Dashboard",
    icon: LayoutGrid,
    description: "Overview of platform statistics and activity.",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: UsersRound,
    description: "Manage all platform users and their roles.",
  },
  {
    href: "/admin/admins",
    label: "Admins",
    icon: Shield,
    description: "Manage administrator accounts and permissions.",
  },
  {
    href: "/admin/moderators",
    label: "Moderators",
    icon: ShieldCheck,
    description: "Manage moderator accounts and reviews.",
  },
  {
    href: "/admin/recruiters",
    label: "Recruiters",
    icon: Building2,
    description: "Manage recruiter accounts and companies.",
  },
  {
    href: "/admin/job-seekers",
    label: "Job Seekers",
    icon: Briefcase,
    description: "Manage job seeker profiles and applications.",
  },
  {
    href: "/admin/reviews",
    label: "Verification Reviews",
    icon: CheckCircle2,
    description: "Review pending verifications.",
  },
  {
    href: "/admin/finance",
    label: "Finance",
    icon: BarChart3,
    description: "Revenue, payments, and billing information.",
  },
  {
    href: "/admin/reports",
    label: "Reports",
    icon: FileText,
    description: "Analytics and detailed platform reports.",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    description: "System settings and configuration.",
  },
  {
    href: "/admin/help",
    label: "Help Center",
    icon: HelpCircle,
    description: "Help and documentation resources.",
  },
];
