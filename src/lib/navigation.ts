import {
  Building2,
  BriefcaseBusiness,
  ClipboardCheck,
  Layers,
  LayoutGrid,
  Tags,
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
    href: "/companies",
    label: "Companies",
    icon: Building2,
    description: "Verify recruiter companies and record the decision.",
  },
  {
    href: "/applications",
    label: "Moderator results",
    icon: ClipboardCheck,
    description:
      "View candidate results, run human interviews, and record decisions.",
  },
  {
    href: "/jobs",
    label: "Jobs",
    icon: BriefcaseBusiness,
    description: "Browse the jobs currently visible to candidates.",
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
];
