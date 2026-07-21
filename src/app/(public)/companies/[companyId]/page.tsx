import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { PublicCompanySummary } from "@/components/public/PublicCompanySummary";
import { publicJobs } from "@/mocks/api";

export function generateStaticParams() {
  const companyIds = Array.from(new Set(publicJobs.map((job) => job.companyId)));
  return companyIds.map((companyId) => ({ companyId: String(companyId) }));
}

export default async function PublicCompanyPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const numericCompanyId = Number(companyId);
  const jobs = publicJobs.filter((job) => job.companyId === numericCompanyId);

  return (
    <PublicShell>
      <main className="bg-canvas">
        <PublicCompanySummary companyId={numericCompanyId} jobs={jobs} />
      </main>
      <PublicFooter />
    </PublicShell>
  );
}
