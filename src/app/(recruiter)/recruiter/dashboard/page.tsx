import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  KeyRound,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  company,
  companyDocuments,
  forwardedApplications,
  recruiterJobs,
  recruiterProfile,
} from "@/mocks/api";

const recentActivity = [
  {
    title: "Published job: Frontend Developer",
    time: "Today, 09:15 AM",
    tone: "success",
  },
  {
    title: "Company verification approved",
    time: "Yesterday, 03:40 PM",
    tone: "info",
  },
  {
    title: "Forwarded candidate received",
    time: "Jul 20, 2026, 08:00 AM",
    tone: "warning",
  },
  {
    title: "Document pending review",
    time: "Jul 18, 2026, 11:30 AM",
    tone: "muted",
  },
];

const permissions = [
  { label: "Company Jobs", icon: BriefcaseBusiness },
  { label: "Talent Discovery", icon: UsersRound },
  { label: "Documents", icon: FileText },
];

export default function RecruiterDashboardPage() {
  const publishedJobs = recruiterJobs.filter(
    (job) => job.status === "PUBLISHED",
  );
  const pendingDocuments = companyDocuments.filter(
    (document) => document.status === "PENDING",
  );

  return (
    <div className="mx-auto max-w-[1060px]">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[14px] font-medium text-[#3d4a3d]">
            <span>Dashboard</span>
            <ChevronRight className="size-4" aria-hidden="true" />
            <span className="font-bold text-[#006e2f]">Recruiter Overview</span>
          </div>
          <h1 className="mt-2 text-[32px] font-bold leading-10 tracking-[-0.64px] text-[#0b1c30]">
            Recruiter Dashboard
          </h1>
        </div>
        <Link
          href="/recruiter/profile"
          className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#006e2f] px-6 text-[12px] font-medium text-white shadow-[0_10px_15px_-3px_rgba(0,110,47,0.2),0_4px_6px_-4px_rgba(0,110,47,0.2)]"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
          Edit Profile
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.95fr)]">
        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-[12px] bg-white p-8 shadow-[0_0_0_1px_rgba(188,203,185,0.16)]">
            <div className="absolute right-[-64px] top-[-64px] size-64 rounded-full bg-[#006e2f]/5 blur-[32px]" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative size-32 shrink-0 overflow-hidden rounded-[24px] shadow-[0_0_0_4px_rgba(34,197,94,0.2)]">
                <Image
                  src="/figma/profile-longg.png"
                  alt="Recruiter profile"
                  fill
                  sizes="128px"
                  className="object-cover"
                  priority
                />
                <span className="absolute bottom-[-8px] right-[-8px] flex size-8 items-center justify-center rounded-[8px] border-4 border-white bg-[#006e2f] text-white">
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-[24px] font-semibold leading-8 tracking-[-0.24px] text-[#0b1c30]">
                  {company.name}
                </h2>
                <p className="mt-1 text-[16px] leading-6 text-[#3d4a3d]">
                  {recruiterProfile.position}{" "}
                  <span className="font-semibold text-[#006e2f]">
                    - {company.industryName}
                  </span>
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <InfoPill icon={MapPin}>Phnom Penh, Cambodia</InfoPill>
                  <InfoPill icon={Clock3}>GMT +7 Local Time</InfoPill>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <DashboardCard
              icon={UserRound}
              title="Company Details"
              iconClassName="bg-[#006e2f]/10 text-[#006e2f]"
            >
              <Detail label="Company Name" value={company.name} />
              <Detail label="Contact Email" value={company.contactEmail} />
              <Detail label="Phone Number" value={company.contactPhone} />
            </DashboardCard>

            <DashboardCard
              icon={ShieldCheck}
              title="Verification"
              iconClassName="bg-[#0058be]/10 text-[#0058be]"
            >
              <StatusRow
                title="Company Verification"
                value={company.verificationStatus}
                success={company.verificationStatus === "APPROVED"}
              />
              <StatusRow
                title="Document Review"
                value={
                  pendingDocuments.length > 0
                    ? `${pendingDocuments.length} pending`
                    : "All clear"
                }
                success={pendingDocuments.length === 0}
              />
            </DashboardCard>
          </div>

          <section>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-[8px] bg-[#006e2f]/10 text-[#006e2f]">
                  <KeyRound className="size-5" aria-hidden="true" />
                </span>
                <h2 className="text-[20px] font-semibold text-[#0b1c30]">
                  Role & Permissions
                </h2>
              </div>
              <span className="rounded-full bg-[#22c55e] px-4 py-1 text-[12px] font-medium text-[#0b1c30]">
                Recruiter Access
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {permissions.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex h-12 items-center gap-3 rounded-[8px] border border-[#bccbb9]/30 bg-white px-4 text-[14px] font-semibold text-[#0b1c30]"
                >
                  <Icon className="size-5 text-[#006e2f]" aria-hidden="true" />
                  <span className="truncate">{label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-10 pt-5">
          <section>
            <h2 className="text-[20px] font-semibold text-[#0b1c30]">
              Notification Preferences
            </h2>
            <div className="mt-5 space-y-4">
              <ToggleRow icon={Mail} label="Email Notifications" checked />
              <ToggleRow icon={Bell} label="Forwarded Candidate Alerts" checked />
              <ToggleRow icon={FileText} label="Document Alerts" />
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[20px] font-semibold text-[#0b1c30]">
                Recent Activity
              </h2>
              <Link
                href="/recruiter/jobs"
                className="text-[12px] font-bold text-[#006e2f]"
              >
                View All
              </Link>
            </div>
            <ol className="space-y-5">
              {recentActivity.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span
                    className={cn(
                      "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full",
                      item.tone === "success" && "bg-[#22c55e] text-white",
                      item.tone === "info" && "bg-[#2d7ff9] text-white",
                      item.tone === "warning" && "bg-[#ff6b6b] text-[#0b1c30]",
                      item.tone === "muted" && "bg-[#eff4ff] text-[#9da3bb]",
                    )}
                  >
                    <CheckCircle2 className="size-3" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold leading-5 text-[#0b1c30]">
                      {item.title}
                    </p>
                    <p className="text-[12px] leading-5 text-[#3d4a3d]">
                      {item.time}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid gap-3">
            <SummaryStrip
              label="Published Jobs"
              value={publishedJobs.length}
              href="/recruiter/jobs"
            />
            <SummaryStrip
              label="Forwarded Candidates"
              value={forwardedApplications.length}
              href="/recruiter/forwarded-candidates"
            />
          </section>
        </aside>
      </div>
    </div>
  );
}

function InfoPill({
  icon: Icon,
  children,
}: {
  icon: typeof MapPin;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex h-8 items-center gap-2 rounded-full border border-[#bccbb9]/30 bg-[#eff4ff] px-3 text-[14px] font-medium text-[#0b1c30]">
      <Icon className="size-4 text-[#006e2f]" aria-hidden="true" />
      {children}
    </span>
  );
}

function DashboardCard({
  icon: Icon,
  title,
  iconClassName,
  children,
}: {
  icon: typeof UserRound;
  title: string;
  iconClassName: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[12px] bg-white p-[25px] shadow-[0_0_0_1px_rgba(188,203,185,0.16)]">
      <div className="mb-6 flex items-center gap-3">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-[8px]",
            iconClassName,
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <h2 className="text-[20px] font-semibold text-[#0b1c30]">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#3d4a3d]">
        {label}
      </p>
      <p className="mt-1 text-[16px] font-medium leading-6 text-[#0b1c30]">
        {value}
      </p>
    </div>
  );
}

function StatusRow({
  title,
  value,
  success,
}: {
  title: string;
  value: string;
  success: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#eff4ff] p-3">
      <div>
        <p className="text-[14px] font-bold text-[#0b1c30]">{title}</p>
        <p className="mt-1 text-[12px] text-[#3d4a3d]">{value}</p>
      </div>
      <CheckCircle2
        className={cn("size-5", success ? "text-[#006e2f]" : "text-[#9da3bb]")}
        aria-hidden="true"
      />
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  checked = false,
}: {
  icon: typeof Mail;
  label: string;
  checked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="size-5 shrink-0 text-[#3d4a3d]" aria-hidden="true" />
        <span className="truncate text-[14px] text-[#3d4a3d]">{label}</span>
      </div>
      <Switch checked={checked} aria-label={label} />
    </div>
  );
}

function SummaryStrip({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-[8px] bg-[#eff4ff] px-4 py-3 text-[#0b1c30] hover:bg-[#e4edff]"
    >
      <span className="text-[13px] font-semibold">{label}</span>
      <span className="text-[18px] font-bold">{value}</span>
    </Link>
  );
}
