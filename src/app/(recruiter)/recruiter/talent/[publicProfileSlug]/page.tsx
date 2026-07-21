import { notFound } from "next/navigation";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { publicTalent } from "@/mocks/api";
import { portfolios, resumes } from "@/mocks/api/job-seeker";

export function generateStaticParams() {
  return publicTalent.map((talent) => ({
    publicProfileSlug: talent.publicProfileSlug,
  }));
}

export default async function TalentDetailPage({
  params,
}: {
  params: Promise<{ publicProfileSlug: string }>;
}) {
  const { publicProfileSlug } = await params;
  const talent = publicTalent.find(
    (item) => item.publicProfileSlug === publicProfileSlug,
  );
  if (!talent) notFound();

  return (
    <>
      <PageIntro
        eyebrow="GET /api/v1/recruiter/talent/{publicProfileSlug}"
        title={talent.headline}
        description="Only public profile, published resumes, and published portfolios are shown here."
      />
      <PlainCard>
        <StatusPill>{talent.salaryVisibility}</StatusPill>
        <p className="mt-3 text-sm leading-6 text-slate-600">{talent.bio}</p>
      </PlainCard>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <PlainCard>
          <h2 className="font-semibold text-heading">Published resumes</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {resumes.filter((resume) => resume.visibility === "PUBLIC").map((resume) => (
              <li key={resume.id}>{resume.title}</li>
            ))}
          </ul>
        </PlainCard>
        <PlainCard>
          <h2 className="font-semibold text-heading">Published portfolios</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {portfolios.filter((portfolio) => portfolio.visibility === "PUBLIC").map((portfolio) => (
              <li key={portfolio.id}>{portfolio.title}</li>
            ))}
          </ul>
        </PlainCard>
      </div>
    </>
  );
}
