import { notFound } from "next/navigation";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { resumes } from "@/mocks/api";

export function generateStaticParams() {
  return resumes.map((resume) => ({ resumeId: String(resume.id) }));
}

export default async function ResumeDetailPage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await params;
  const resume = resumes.find((item) => item.id === Number(resumeId));
  if (!resume) notFound();

  return (
    <>
      <PageIntro
        eyebrow="GET/PATCH/DELETE /api/v1/job-seeker/resumes/{resumeId}"
        title={resume.title}
        description="Publication action uses PATCH /publication with visibility PUBLIC, PRIVATE, or HIDDEN."
      />
      <PlainCard>
        <StatusPill>{resume.visibility}</StatusPill>
        <p className="mt-3 text-sm text-slate-600">{resume.resumeFileUrl}</p>
      </PlainCard>
    </>
  );
}
