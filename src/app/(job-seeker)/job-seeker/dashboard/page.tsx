"use client";

import { MetricCard, PageIntro, PlainCard } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  useGetAiInterviewsQuery,
  useGetApplicationsQuery,
  useGetJobSeekerProfileQuery,
  useGetPortfoliosQuery,
  useGetResumesQuery,
} from "@/services/jobSeekerApi";

export default function JobSeekerDashboardPage() {
  const profileQuery = useGetJobSeekerProfileQuery();
  const resumesQuery = useGetResumesQuery();
  const portfoliosQuery = useGetPortfoliosQuery();
  const applicationsQuery = useGetApplicationsQuery();
  const interviewsQuery = useGetAiInterviewsQuery();

  const queries = [profileQuery, resumesQuery, portfoliosQuery, applicationsQuery, interviewsQuery];
  if (queries.some((query) => query.isLoading)) return <LoadingState rows={6} />;
  if (queries.some((query) => query.isError) || !profileQuery.data) {
    return <ErrorState message="Unable to load the dashboard." />;
  }

  const profile = profileQuery.data;
  const resumes = resumesQuery.data ?? [];
  const portfolios = portfoliosQuery.data ?? [];
  const applications = applicationsQuery.data ?? [];
  const interviews = interviewsQuery.data ?? [];

  return (
    <>
      <PageIntro
        eyebrow="Job seeker"
        title="Dashboard"
        description="Own profile, publication controls, resumes, portfolios, applications, and AI interviews."
      />
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricCard label="Resumes" value={resumes.length} />
        <MetricCard label="Portfolios" value={portfolios.length} />
        <MetricCard label="Applications" value={applications.length} />
        <MetricCard label="AI interviews" value={interviews.length} />
      </div>
      <div className="mt-6">
        <PlainCard>
          <h2 className="font-semibold text-heading">Profile publication</h2>
          <p className="mt-2 text-sm text-slate-600">
            Current visibility: {profile.profileVisibility}
          </p>
        </PlainCard>
      </div>
    </>
  );
}
