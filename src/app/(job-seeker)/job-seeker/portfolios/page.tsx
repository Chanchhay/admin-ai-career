"use client";

import Link from "next/link";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetPortfoliosQuery } from "@/services/jobSeekerApi";

export default function PortfoliosPage() {
  const portfoliosQuery = useGetPortfoliosQuery();
  if (portfoliosQuery.isLoading) return <LoadingState rows={5} />;
  if (portfoliosQuery.isError) return <ErrorState message="Unable to load portfolios." />;
  const portfolios = portfoliosQuery.data ?? [];

  return (
    <>
      <PageIntro eyebrow="GET /api/v1/job-seeker/portfolios" title="Portfolios" />
      <div className="grid gap-4">
        {portfolios.map((portfolio) => (
          <Link key={portfolio.id} href={`/job-seeker/portfolios/${portfolio.id}`}>
            <PlainCard>
              <div className="flex justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-heading">{portfolio.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{portfolio.summary}</p>
                </div>
                <StatusPill>{portfolio.visibility}</StatusPill>
              </div>
            </PlainCard>
          </Link>
        ))}
      </div>
    </>
  );
}
