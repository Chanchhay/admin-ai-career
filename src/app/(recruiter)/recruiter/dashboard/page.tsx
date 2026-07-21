import { MetricCard, PageIntro, PlainCard } from "@/components/shared/ApiCards";
import { recruiterDashboard } from "@/mocks/api";

export default function RecruiterDashboardPage() {
  return (
    <>
      <PageIntro
        eyebrow="Recruiter"
        title="Dashboard"
        description="Company jobs, public talent discovery, and forwarded applications."
      />
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricCard label="Jobs" value={recruiterDashboard.jobs.length} />
        <MetricCard label="Published" value={recruiterDashboard.jobs.filter((job) => job.status === "PUBLISHED").length} />
        <MetricCard label="Public talent" value={recruiterDashboard.talent.length} />
        <MetricCard label="Forwarded" value={recruiterDashboard.forwardedApplications.length} />
      </div>
      <div className="mt-6">
        <PlainCard>
          <h2 className="font-semibold text-heading">{recruiterDashboard.company.name}</h2>
          <p className="mt-2 text-sm text-slate-600">
            Verification: {recruiterDashboard.company.verificationStatus}
          </p>
        </PlainCard>
      </div>
    </>
  );
}
