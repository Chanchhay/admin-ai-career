"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { JobsWorkspace } from "@/components/job-seeker/workspace/JobsWorkspace";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  useGetApplicationsQuery,
  useGetResumesQuery,
} from "@/services/jobSeekerApi";
import { useGetPublicJobsQuery } from "@/services/publicApi";

export default function JobSeekerJobsPage() {
  /* `?q=` is read on the client, so the shell can hand its search box over. */
  return (
    <Suspense fallback={<LoadingState rows={6} />}>
      <JobsExplorer />
    </Suspense>
  );
}

function JobsExplorer() {
  const searchParams = useSearchParams();
  const jobsQuery = useGetPublicJobsQuery({ page: 0, size: 100 });
  const resumesQuery = useGetResumesQuery();
  const applicationsQuery = useGetApplicationsQuery();

  const queries = [jobsQuery, resumesQuery, applicationsQuery];

  if (queries.some((query) => query.isLoading)) return <LoadingState rows={6} />;
  if (jobsQuery.isError || !jobsQuery.data) {
    return <ErrorState message="Unable to load published jobs." />;
  }

  return (
    <JobsWorkspace
      jobs={jobsQuery.data.content ?? []}
      resumes={resumesQuery.data ?? []}
      applications={applicationsQuery.data ?? []}
      initialKeyword={searchParams.get("q") ?? ""}
    />
  );
}
