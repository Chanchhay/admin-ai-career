"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  KeyRound,
  MapPin,
  Pencil,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetCurrentUserQuery } from "@/services/authApi";
import {
  useGetCompanyDocumentsQuery,
  useGetForwardedApplicationsQuery,
  useGetRecruiterCompanyQuery,
  useGetRecruiterJobsQuery,
} from "@/services/recruiterApi";

const permissions = [
  { label: "Company Jobs", icon: BriefcaseBusiness },
  { label: "Talent Discovery", icon: UsersRound },
  { label: "Documents", icon: FileText },
];

export default function RecruiterDashboardPage() {
  const currentUserQuery = useGetCurrentUserQuery();
  const companyQuery = useGetRecruiterCompanyQuery();
  const jobsQuery = useGetRecruiterJobsQuery();
  const forwardedQuery = useGetForwardedApplicationsQuery();
  const documentsQuery = useGetCompanyDocumentsQuery(companyQuery.data?.id ?? 0, {
    skip: !companyQuery.data,
  });

  const queries = [
    currentUserQuery,
    companyQuery,
    jobsQuery,
    forwardedQuery,
    documentsQuery,
  ];
  if (queries.some((query) => query.isLoading)) return <LoadingState rows={8} />;
  if (
    queries.some((query) => query.isError) ||
    !currentUserQuery.data ||
    !companyQuery.data
  ) {
    return <ErrorState message="Unable to load the recruiter dashboard." />;
  }

  const currentUser = currentUserQuery.data;
  const company = companyQuery.data;
  const recruiterJobs = jobsQuery.data ?? [];
  const forwardedApplications = forwardedQuery.data ?? [];
  const companyDocuments = documentsQuery.data ?? [];
  const publishedJobs = recruiterJobs.filter(
    (job) => job.status === "PUBLISHED",
  );
  const pendingDocuments = companyDocuments.filter(
    (document) => document.status === "PENDING",
  );

  return (
    <div>
      {/* Title and description come from the shell header via PageIntro. */}
      <div className="mb-6 flex justify-end">
        <Link
          href="/recruiter/profile"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          <Pencil className="size-4" aria-hidden="true" />
          Edit Profile
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.95fr)]">
        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-[12px] bg-white p-8 shadow-[0_0_0_1px_rgba(188,203,185,0.16)]">
            <div className="absolute right-[-64px] top-[-64px] size-64 rounded-full bg-[#006e2f]/5 blur-[32px]" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative flex size-32 shrink-0 items-center justify-center rounded-[24px] bg-[#eff4ff] text-4xl font-bold text-[#006e2f] shadow-[0_0_0_4px_rgba(34,197,94,0.2)]">
                {company.name.charAt(0).toUpperCase()}
                {company.verificationStatus === "APPROVED" ? (
                  <span className="absolute bottom-[-8px] right-[-8px] flex size-8 items-center justify-center rounded-[8px] border-4 border-white bg-[#006e2f] text-white">
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                  </span>
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-[24px] font-semibold leading-8 tracking-[-0.24px] text-[#0b1c30]">
                  {company.name}
                </h2>
                <p className="mt-1 text-[16px] leading-6 text-[#3d4a3d]">
                  {currentUser.fullName}{" "}
                  <span className="font-semibold text-[#006e2f]">
                    - {company.industryName}
                  </span>
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <InfoPill icon={MapPin}>{company.address}</InfoPill>
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
