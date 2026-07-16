import Link from "next/link";

const LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Audit Logs", href: "/audit-logs" },
];

export function AppFooter() {
  return (
    <footer className="mt-10 flex flex-col gap-3 border-t border-slate-200/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <nav aria-label="Footer" className="flex items-center gap-5">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs font-medium text-slate-500 transition-colors duration-200 hover:text-heading"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <p className="flex items-center gap-2 text-xs text-slate-500">
        © 2024 TalentPulse AI Recruitment Engine v4.2.0
        <span aria-hidden="true" className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-70" />
          <span className="relative inline-flex size-2 rounded-full bg-brand" />
        </span>
        <span className="sr-only">System operational</span>
      </p>
    </footer>
  );
}