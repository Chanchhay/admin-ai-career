import {
  BarChart3,
  Bot,
  Building2,
  Layers,
  LayoutGrid,
  PieChart,
  Tags,
  UserCog,
  UsersRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  /** Written without the `/admin` prefix — `basePath` adds it. */
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
};

/**
 * The console's sections, each backed by real endpoints: companies and
 * applications by `/moderator/**`, the reference data by `/admin/**`. Nothing
 * is listed here that the API cannot serve.
 */
export const adminNavigation: NavigationItem[] = [
  {
    href: "/",
    label: "Overview",
    icon: LayoutGrid,
    description: "What is waiting on a moderator right now.",
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "Platform-wide numbers: accounts, activity, and revenue.",
  },
  {
    href: "/companies",
    label: "Companies",
    icon: Building2,
    description: "Verify recruiter companies and record the decision.",
  },
  {
    href: "/applications",
    label: "Applications",
    icon: UsersRound,
    description:
      "Review candidates, run human interviews, forward to recruiters.",
  },
  {
    href: "/decisions",
    label: "Decisions",
    icon: PieChart,
    description:
      "Approve/reject split and recent decisions for companies and candidates.",
  },
  {
    href: "/users",
    label: "Users",
    icon: UserCog,
    description: "Every account on the platform, with its role and status.",
  },
  {
    href: "/industries",
    label: "Industries",
    icon: Layers,
    description: "The industry list companies are classified by.",
  },
  {
    href: "/job-categories",
    label: "Job categories",
    icon: Tags,
    description: "The categories recruiters file job posts under.",
  },
  {
    href: "/skills",
    label: "Skills",
    icon: Wrench,
    description: "The skill vocabulary shared by jobs and resumes.",
  },
  {
    href: "/ai-interview",
    label: "AI interview",
    icon: Bot,
    description: "How many questions each AI interview asks, and of which types.",
  },
];
