import { notFound } from "next/navigation";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import {
  PageIntro,
  PlainCard,
  PrimaryLink,
  StatusPill,
} from "@/components/shared/ApiCards";
import { publicJobs } from "@/mocks/api";

export function generateStaticParams() {
  return publicJobs.map((job) => ({ jobId: String(job.id) }));
}

export default async function PublicJobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = publicJobs.find((item) => item.id === Number(jobId));

  if (!job) notFound();

  return (
    <PublicShell>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="GET /api/v1/public/jobs/{jobId}"
          title={job.title}
          description={`${job.companyName} - ${job.location}`}
          action={<PrimaryLink href="/job-seeker/applications">Apply preview</PrimaryLink>}
        />
        <div className="mb-6 flex flex-wrap gap-2">
          <StatusPill>{job.categoryName}</StatusPill>
          <StatusPill>{job.jobType}</StatusPill>
          <StatusPill>{job.workMode}</StatusPill>
          <StatusPill>{job.experienceLevel}</StatusPill>
        </div>
        <div className="grid gap-4">
          {job.sections.map((section) => (
            <PlainCard key={section.id}>
              <p className="text-xs font-semibold uppercase text-brand">
                {section.sectionType}
              </p>
              <h2 className="mt-1 font-semibold text-heading">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {section.contentText}
              </p>
            </PlainCard>
          ))}
          <PlainCard>
            <h2 className="font-semibold text-heading">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <StatusPill key={skill.id}>
                  {skill.skillName} - {skill.requiredLevel}
                </StatusPill>
              ))}
            </div>
          </PlainCard>
        </div>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}
