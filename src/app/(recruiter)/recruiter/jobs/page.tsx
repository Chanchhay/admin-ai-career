"use client";

import Link from "next/link";
import {
  PageIntro,
  PlainCard,
  PrimaryLink,
  StatusPill,
} from "@/components/shared/ApiCards";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { JobStatusActions } from "@/components/recruiter/JobStatusActions";
import { useGetRecruiterJobsQuery } from "@/services/recruiterApi";

export default function RecruiterJobsPage() {
  const jobsQuery = useGetRecruiterJobsQuery();

  if (jobsQuery.isLoading) return <LoadingState rows={5} />;
  if (jobsQuery.isError) {
    return <ErrorState message="Unable to load company jobs." />;
  }

  const recruiterJobs = jobsQuery.data ?? [];

  return (
    <>
      <PageIntro
        title="Company jobs"
        description="Draft, publish, pause, and close the roles your company is hiring for."
        action={<PrimaryLink href="/recruiter/jobs/new">Create job</PrimaryLink>}
      />
      {recruiterJobs.length === 0 ? (
        <EmptyState
          title="No jobs yet"
          description="Create a draft to start hiring."
          action={
            <PrimaryLink href="/recruiter/jobs/new">Create job</PrimaryLink>
          }
        />
      ) : (
        <div className="grid gap-4">
          {recruiterJobs.map((job) => (
            <PlainCard key={job.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    href={`/recruiter/jobs/${job.id}`}
                    className="font-semibold text-heading hover:text-brand"
                  >
                    {job.title}
                  </Link>
                  <p className="mt-1 text-sm text-body">
                    {[job.categoryName, job.location]
                      .filter(Boolean)
                      .join(" · ") || "No category"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusPill>{job.status}</StatusPill>
                  <JobStatusActions job={job} />
                </div>
              </div>
            </PlainCard>
          ))}
        </div>
      )}
    </>
  );
}
