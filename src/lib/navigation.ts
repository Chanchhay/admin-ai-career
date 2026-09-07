import {
  Bot,
  CalendarDays,
  Cpu,
  Building2,
  ClipboardCheck,
  Layers,
  MessagesSquare,
  ReceiptText,
  LayoutGrid,
  UsersRound,
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
    href: "/interviews",
    label: "Interviews",
    icon: CalendarDays,
    description:
      "Calendar schedule of candidate interviews across all applications.",
  },
  {
    href: "/finance",
    label: "Finance",
    icon: ReceiptText,
    description:
      "Reported hires, the commissions confirming them creates, and the invoices that bill them.",
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
    label: "Platform lists",
    icon: Layers,
    description: "Manage industries, job categories, and skills.",
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
