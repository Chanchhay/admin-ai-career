"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { ResumeDocument } from "@/components/job-seeker/ResumeDocument";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { useGetResumeQuery } from "@/services/jobSeekerApi";

export default function ViewResumePage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const resumeQuery = useGetResumeQuery(resumeId);

  if (resumeQuery.isLoading) return <LoadingState rows={5} />;
  if (resumeQuery.isError || !resumeQuery.data) return <ErrorState message="Unable to load this resume." />;
  const resume = resumeQuery.data;

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={`Preview: ${resume.title}`} description="Review your resume before using it in an application." />
      <div className="mb-5 flex items-center justify-between gap-3 print:hidden">
        <Link href={`/job-seeker/resumes/${resume.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-ws-muted hover:text-ws-fg"><ArrowLeft className="size-4" /> Back to resume</Link>
        <Button onClick={() => window.print()} className="rounded-xl"><Printer /> Print or save PDF</Button>
      </div>
      <div className="rounded-[24px] bg-ws-card-hover p-4 sm:p-8 print:bg-white print:p-0">
        <ResumeDocument title={resume.title} data={resume.resumeData} />
      </div>
    </div>
  );
}
