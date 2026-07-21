import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { PageIntro, PlainCard } from "@/components/shared/ApiCards";
import { publicJobs } from "@/mocks/api";

export default async function PublicCompanyPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const jobs = publicJobs.filter((job) => job.companyId === Number(companyId));
  const companyName = jobs[0]?.companyName ?? "Company";

  return (
    <PublicShell>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="No public company detail endpoint"
          title={companyName}
          description="The OpenAPI file does not expose a public company detail endpoint, so this page only shows company information already present on public job responses."
        />
        <PlainCard>
          <h2 className="font-semibold text-heading">Published jobs</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {jobs.map((job) => (
              <li key={job.id}>{job.title}</li>
            ))}
          </ul>
        </PlainCard>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}
