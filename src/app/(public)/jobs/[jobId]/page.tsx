"use client";

import { useParams } from "next/navigation";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { PublicJobDetails } from "@/components/public/PublicJobDetails";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  useGetPublicJobQuery,
  useGetPublicJobsQuery,
} from "@/services/publicApi";

export default function PublicJobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const jobQuery = useGetPublicJobQuery(jobId);
  const relatedQuery = useGetPublicJobsQuery(
    { categoryId: jobQuery.data?.categoryId, size: 4 },
    { skip: !jobQuery.data },
  );

  if (jobQuery.isLoading || relatedQuery.isLoading) {
    return (
      <PublicShell>
        <main className="mx-auto max-w-7xl px-4 py-10">
          <LoadingState rows={5} />
        </main>
      </PublicShell>
    );
  }

  if (jobQuery.isError || !jobQuery.data || relatedQuery.isError) {
    return (
      <PublicShell>
        <main className="mx-auto max-w-7xl px-4 py-10">
          <ErrorState message="Unable to load this job." />
        </main>
      </PublicShell>
    );
  }

  const job = jobQuery.data;
  const relatedJobs = (relatedQuery.data?.content ?? [])
    .filter((item) => item.id !== job.id && item.categoryId === job.categoryId)
    .slice(0, 3);

  return (
    <PublicShell>
      <main className="pb-12">
        <PublicJobDetails job={job} relatedJobs={relatedJobs} />
      </main>
      <PublicFooter />
    </PublicShell>
  );
}
