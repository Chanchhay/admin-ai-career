import {
  Bot,
  Cpu,
  Building2,
  BriefcaseBusiness,
  ClipboardCheck,
  Layers,
  HandCoins,
  MessagesSquare,
  ReceiptText,
  LayoutGrid,
  Tags,
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
    href: "/hires",
    label: "Hires",
    icon: HandCoins,
    description: "Confirm the hires recruiters report, which creates commissions.",
  },
  {
    href: "/finance",
    label: "Finance",
    icon: ReceiptText,
    description: "Commissions, invoices, and payments.",
  },
  {
    href: "/messages",
    label: "Messages",
    icon: MessagesSquare,
    description: "Threads you have opened with candidates and recruiters.",
  },
  {
    href: "/users",
    label: "Users",
    icon: UsersRound,
    description: "Platform accounts, their roles, and whether they may sign in.",
  },
  {
    href: "/industries",
    label: "Categories",
    icon: Layers,
    description: "The industry, job-category and skill vocabulary companies, jobs, and resumes draw from.",
  },
  {
    href: "/ai-interview",
    label: "AI interview",
    icon: Bot,
    description: "How many questions each AI interview asks, and of which types.",
  },
  {
    href: "/ai-engine",
    label: "AI engine",
    icon: Cpu,
    description: "The model, API key and tuning every AI feature runs on.",
  },
];
