"use client";

import { useParams } from "next/navigation";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetPortfolioQuery } from "@/services/jobSeekerApi";

export default function PortfolioDetailPage() {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const portfolioQuery = useGetPortfolioQuery(portfolioId);
  if (portfolioQuery.isLoading) return <LoadingState rows={5} />;
  if (portfolioQuery.isError || !portfolioQuery.data) return <ErrorState message="Unable to load this portfolio." />;
  const portfolio = portfolioQuery.data;

  return (
    <>
      <PageIntro
        eyebrow="GET/PATCH/DELETE /api/v1/job-seeker/portfolios/{portfolioId}"
        title={portfolio.title}
        description={portfolio.summary}
      />
      <div className="grid gap-4">
        {portfolio.projects.map((project) => (
          <PlainCard key={project.id}>
            <div className="flex justify-between gap-3">
              <div>
                <h2 className="font-semibold text-heading">{project.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{project.description}</p>
              </div>
              <StatusPill>{portfolio.visibility}</StatusPill>
            </div>
          </PlainCard>
        ))}
      </div>
    </>
  );
}
