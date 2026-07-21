import Link from "next/link";
import type { ReactNode } from "react";

type RoleShellProps = {
  role: "job-seeker" | "recruiter";
  title: string;
  links: { href: string; label: string }[];
  children: ReactNode;
};

export function RoleShell({ role, title, links, children }: RoleShellProps) {
  return (
    <div className="min-h-screen bg-canvas text-slate-950">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-4 p-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-lg bg-white p-4 shadow-sm">
          <Link href="/" className="text-lg font-bold text-heading">
            AI Career
          </Link>
          <p className="mt-1 text-xs font-semibold uppercase text-brand">
            {role}
          </p>
          <nav aria-label={`${title} navigation`} className="mt-6 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-brand-tint hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="rounded-lg bg-white p-5 shadow-sm lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export const jobSeekerLinks = [
  { href: "/job-seeker/dashboard", label: "Dashboard" },
  { href: "/job-seeker/profile", label: "Profile" },
  { href: "/job-seeker/resumes", label: "Resumes" },
  { href: "/job-seeker/portfolios", label: "Portfolios" },
  { href: "/job-seeker/applications", label: "Applications" },
  { href: "/job-seeker/interviews", label: "AI Interviews" },
];

export const recruiterLinks = [
  { href: "/recruiter/dashboard", label: "Dashboard" },
  { href: "/recruiter/profile", label: "Profile" },
  { href: "/recruiter/company", label: "Company" },
  { href: "/recruiter/company/documents", label: "Documents" },
  { href: "/recruiter/jobs", label: "Jobs" },
  { href: "/recruiter/talent", label: "Public Talent" },
  { href: "/recruiter/forwarded-candidates", label: "Forwarded Candidates" },
];
