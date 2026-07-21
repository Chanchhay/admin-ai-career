import Link from "next/link";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { resumes } from "@/mocks/api";

export default function ResumesPage() {
  return (
    <>
      <PageIntro
        eyebrow="GET /api/v1/job-seeker/resumes"
        title="Resumes"
        description="Resume mocks follow ResumeResponse and support publication visibility."
      />
      <div className="grid gap-4">
        {resumes.map((resume) => (
          <Link key={resume.id} href={`/job-seeker/resumes/${resume.id}`}>
            <PlainCard>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-heading">{resume.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {resume.isDefault ? "Default resume" : "Resume"}
                  </p>
                </div>
                <StatusPill>{resume.visibility}</StatusPill>
              </div>
            </PlainCard>
          </Link>
        ))}
      </div>
    </>
  );
}
