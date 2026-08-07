"use client";

import { OverviewWorkspace } from "@/components/job-seeker/workspace/OverviewWorkspace";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetCurrentUserQuery } from "@/services/authApi";
import {
  useGetAiInterviewsQuery,
  useGetApplicationsQuery,
  useGetJobSeekerProfileQuery,
  useGetPortfoliosQuery,
  useGetResumesQuery,
} from "@/services/jobSeekerApi";

export default function JobSeekerOverviewPage() {
  const userQuery = useGetCurrentUserQuery();
  const profileQuery = useGetJobSeekerProfileQuery();
  const resumesQuery = useGetResumesQuery();
  const portfoliosQuery = useGetPortfoliosQuery();
  const applicationsQuery = useGetApplicationsQuery();
  const interviewsQuery = useGetAiInterviewsQuery();

  const queries = [
    profileQuery,
    resumesQuery,
    portfoliosQuery,
    applicationsQuery,
    interviewsQuery,
  ];

  if (queries.some((query) => query.isLoading)) return <LoadingState rows={6} />;
  if (queries.some((query) => query.isError) || !profileQuery.data) {
    return <ErrorState message="Unable to load your workspace." />;
  }

  return (
    <OverviewWorkspace
      user={userQuery.data}
      profile={profileQuery.data}
      resumes={resumesQuery.data ?? []}
      portfolios={portfoliosQuery.data ?? []}
      applications={applicationsQuery.data ?? []}
      interviews={interviewsQuery.data ?? []}
    />
  );
}
