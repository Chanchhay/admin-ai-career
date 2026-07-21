import { MetricCard, PageIntro, PlainCard } from "@/components/shared/ApiCards";
import { jobSeekerDashboard } from "@/mocks/api";

export default function JobSeekerDashboardPage() {
  return (
    <>
      <PageIntro
        eyebrow="Job seeker"
        title="Dashboard"
        description="Own profile, publication controls, resumes, portfolios, applications, and AI interviews."
      />
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricCard label="Resumes" value={jobSeekerDashboard.resumes.length} />
        <MetricCard label="Portfolios" value={jobSeekerDashboard.portfolios.length} />
        <MetricCard label="Applications" value={jobSeekerDashboard.applications.length} />
        <MetricCard label="AI interviews" value={jobSeekerDashboard.interviews.length} />
      </div>
      <div className="mt-6">
        <PlainCard>
          <h2 className="font-semibold text-heading">Profile publication</h2>
          <p className="mt-2 text-sm text-slate-600">
            Current visibility: {jobSeekerDashboard.profile.profileVisibility}
          </p>
        </PlainCard>
      </div>
    </>
  );
}
