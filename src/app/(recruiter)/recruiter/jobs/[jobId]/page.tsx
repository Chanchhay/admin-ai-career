import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { recruiterJobs } from "@/mocks/api";

export function generateStaticParams() {
  return recruiterJobs.map((job) => ({ jobId: String(job.id) }));
}

export default async function RecruiterJobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = recruiterJobs.find((item) => item.id === Number(jobId));
  if (!job) notFound();

  return (
    <>
      <PageIntro
        eyebrow="GET /api/v1/recruiter/jobs/{id}"
        title={job.title}
        description="Supported actions: publish, pause, resume, close."
        action={<Link className="text-sm font-semibold text-brand" href={`/recruiter/jobs/${job.id}/edit`}>Edit</Link>}
      />
      <PlainCard>
        <StatusPill>{job.status}</StatusPill>
        <p className="mt-3 text-sm leading-6 text-slate-600">{job.description}</p>
      </PlainCard>
    </>
  );
}
