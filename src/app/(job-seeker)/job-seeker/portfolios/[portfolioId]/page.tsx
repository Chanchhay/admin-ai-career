import { notFound } from "next/navigation";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { portfolios } from "@/mocks/api";

export function generateStaticParams() {
  return portfolios.map((portfolio) => ({ portfolioId: String(portfolio.id) }));
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ portfolioId: string }>;
}) {
  const { portfolioId } = await params;
  const portfolio = portfolios.find((item) => item.id === Number(portfolioId));
  if (!portfolio) notFound();

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
