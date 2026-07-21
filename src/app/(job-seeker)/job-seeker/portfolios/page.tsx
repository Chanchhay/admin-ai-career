import Link from "next/link";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { portfolios } from "@/mocks/api";

export default function PortfoliosPage() {
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
