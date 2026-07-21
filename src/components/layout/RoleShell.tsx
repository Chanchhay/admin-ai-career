"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Bell,
  Briefcase,
  Building2,
  FileText,
  FolderKanban,
  LayoutGrid,
  Search,
  Settings,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RoleShellProps = {
  role: "job-seeker" | "recruiter";
  title: string;
  links: { href: string; label: string; icon: LucideIcon }[];
  children: ReactNode;
};

export function RoleShell({ role, title, links, children }: RoleShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#d0e1fb] text-[#0b1c30]">
      <div className="mx-auto grid min-h-screen max-w-[1440px] gap-0 p-0 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="relative px-2 py-6">
          <Link
            href="/"
            className="flex h-[82px] items-center px-3"
            aria-label="AI Career home"
          >
            <Image
              src="/figma/brand-logo.png"
              alt="AI Career"
              width={155}
              height={84}
              className="h-[70px] w-[128px] object-contain object-left"
              priority
            />
          </Link>
          <p className="mt-12 px-3 text-[12px] font-bold uppercase text-[#464343]/60">
            Main menu
          </p>
          <nav
            aria-label={`${title} navigation`}
            className="mt-5 flex flex-col gap-1"
          >
            {links.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                active={
                  link.href === `/${role}/dashboard`
                    ? pathname === link.href
                    : pathname.startsWith(link.href)
                }
              >
                {link.label}
              </SidebarLink>
            ))}
          </nav>
        </aside>
        <main className="p-4 lg:py-[23px] lg:pr-[54px]">
          <div className="min-h-[calc(100vh-46px)] rounded-[30px] bg-white p-6 shadow-sm lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  active,
  children,
}: {
  href: string;
  icon: LucideIcon;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-[41px] items-center gap-[18px] rounded-l-[30px] px-4 text-[14px] font-semibold transition-colors",
        active
          ? "bg-white text-[#006e2f]"
          : "text-[#464343] hover:bg-white/60 hover:text-[#006e2f]",
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <span className="truncate">{children}</span>
    </Link>
  );
}

export const jobSeekerLinks = [
  { href: "/job-seeker/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/job-seeker/profile", label: "Profile", icon: UserRound },
  { href: "/job-seeker/resumes", label: "Resumes", icon: FileText },
  { href: "/job-seeker/portfolios", label: "Portfolios", icon: FolderKanban },
  { href: "/job-seeker/applications", label: "Applications", icon: Briefcase },
  { href: "/job-seeker/interviews", label: "AI Interviews", icon: Bell },
];

export const recruiterLinks = [
  { href: "/recruiter/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/recruiter/company", label: "Company", icon: Building2 },
  { href: "/recruiter/jobs", label: "Jobs", icon: Briefcase },
  { href: "/recruiter/talent", label: "Talent", icon: Search },
  {
    href: "/recruiter/forwarded-candidates",
    label: "Forwarded",
    icon: UsersRound,
  },
  { href: "/recruiter/company/documents", label: "Documents", icon: FileText },
  { href: "/recruiter/profile", label: "Settings", icon: Settings },
];
