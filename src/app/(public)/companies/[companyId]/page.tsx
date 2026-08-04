"use client";

import { useParams } from "next/navigation";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { PublicCompanySummary } from "@/components/public/PublicCompanySummary";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetPublicJobsQuery } from "@/services/publicApi";

export default function PublicCompanyPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const numericCompanyId = Number(companyId);
  const jobsQuery = useGetPublicJobsQuery({ size: 100 });

  if (jobsQuery.isLoading) {
    return <PublicShell><main className="mx-auto max-w-7xl px-4 py-10"><LoadingState rows={5} /></main></PublicShell>;
  }
  if (jobsQuery.isError) {
    return <PublicShell><main className="mx-auto max-w-7xl px-4 py-10"><ErrorState message="Unable to load company jobs." /></main></PublicShell>;
  }

  const jobs = (jobsQuery.data?.content ?? []).filter(
    (job) => job.companyId === numericCompanyId,
  );

  return (
    <PublicShell>
      <main className="bg-canvas">
        <PublicCompanySummary companyId={numericCompanyId} jobs={jobs} />
      </main>
      <PublicFooter />
    </PublicShell>
  );
}
