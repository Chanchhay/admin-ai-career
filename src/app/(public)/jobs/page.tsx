"use client";

import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { PageContainer } from "@/components/shared/PageContainer";
import { PublicJobExplorer } from "@/components/public/PublicJobExplorer";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  useGetPublicJobCategoriesQuery,
  useGetPublicJobsQuery,
  useGetPublicSkillsQuery,
} from "@/services/publicApi";

export default function PublicJobsPage() {
  const jobs = useGetPublicJobsQuery({ size: 100 });
  const categories = useGetPublicJobCategoriesQuery();
  const skills = useGetPublicSkillsQuery();

  const content =
    jobs.isLoading || categories.isLoading || skills.isLoading ? (
      <LoadingState rows={6} />
    ) : jobs.isError || categories.isError || skills.isError ? (
      <ErrorState message="Unable to load published jobs." />
    ) : (
      <PublicJobExplorer
        jobs={jobs.data?.content ?? []}
        categories={categories.data ?? []}
        skills={skills.data ?? []}
      />
    );

  return (
    <PublicShell>
      <main className="bg-canvas py-10">
        <PageContainer>
          {content}
        </PageContainer>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}
