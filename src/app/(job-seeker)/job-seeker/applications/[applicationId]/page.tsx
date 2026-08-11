"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, CalendarDays, Check, Clock3, ExternalLink, FileText, MessageSquareText } from "lucide-react";
import type { JobApplicationStatus } from "@/contracts";
import { StartApplicationInterviewButton } from "@/components/job-seeker/StartApplicationInterviewButton";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetApplicationQuery, useGetResumeQuery } from "@/services/jobSeekerApi";

export default function ApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const query = useGetApplicationQuery(applicationId);
  const resumeQuery = useGetResumeQuery(query.data?.resumeId ?? 0, { skip: !query.data?.resumeId });
  if (query.isLoading) return <LoadingState rows={4} />;
  if (query.isError || !query.data) return <ErrorState message="Unable to load this application." />;
  const application = query.data;
  const status = displayStatus(application.status);

  return <div className="mx-auto max-w-6xl">
    <PageIntro title={application.jobTitle} description="Application details and progress." />
    <Link href="/job-seeker/applications" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-ws-muted hover:text-ws-fg"><ArrowLeft className="size-4" /> All applications</Link>

    <section className="mb-5 overflow-hidden rounded-[24px] bg-ws-card">
      <div className="flex flex-col gap-6 bg-linear-to-br from-primary/15 to-transparent p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8"><div><span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}>{status.label}</span><h2 className="mt-5 text-2xl font-semibold tracking-tight text-ws-fg sm:text-3xl">{application.jobTitle}</h2><p className="mt-2 flex items-center gap-2 text-sm text-ws-muted"><CalendarDays className="size-4" /> Applied {formatDate(application.appliedAt || application.createdAt)}</p></div><div className="flex flex-wrap gap-2"><Link href={`/jobs/${application.jobId}`} className="inline-flex h-10 items-center gap-2 rounded-xl bg-ws-panel px-4 text-sm font-semibold text-ws-fg"><BriefcaseBusiness className="size-4" /> View job <ExternalLink className="size-3.5" /></Link><StartApplicationInterviewButton applicationId={applicationId} /></div></div>
    </section>

    <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="space-y-5">
        <section className="rounded-[22px] bg-ws-card p-6"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-chip-soft text-chip-soft-fg"><Clock3 className="size-4.5" /></span><div><h2 className="font-semibold text-ws-fg">Application progress</h2><p className="mt-0.5 text-xs text-ws-muted">Your current stage in the hiring process</p></div></div><ApplicationTimeline status={application.status} /></section>
        <section className="rounded-[22px] bg-ws-card p-6"><div className="flex items-center gap-3"><MessageSquareText className="size-5 text-primary" /><h2 className="font-semibold text-ws-fg">Cover letter</h2></div>{application.coverLetter ? <p className="mt-5 whitespace-pre-line text-sm leading-7 text-ws-muted">{application.coverLetter}</p> : <p className="mt-5 text-sm text-ws-faint">No cover letter was included with this application.</p>}</section>
      </div>

      <aside className="space-y-5">
        <section className="rounded-[22px] bg-ws-card p-5"><h2 className="text-sm font-semibold text-ws-fg">Submitted resume</h2><div className="mt-4 flex items-center gap-3 rounded-2xl bg-ws-panel p-4"><span className="flex size-10 items-center justify-center rounded-xl bg-chip-soft text-chip-soft-fg"><FileText className="size-4.5" /></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-ws-fg">{application.resumeTitle || resumeQuery.data?.title || "Attached resume"}</p><p className="mt-0.5 text-xs text-ws-muted">Submitted with application</p></div></div>{application.resumeId ? <Link href={`/job-seeker/resumes/${application.resumeId}`} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-primary hover:bg-chip-soft">View resume <ExternalLink className="size-3.5" /></Link> : null}</section>
        <section className="rounded-[22px] bg-ws-card p-5"><h2 className="text-sm font-semibold text-ws-fg">Application reference</h2><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-ws-muted">Application ID</dt><dd className="font-medium text-ws-fg">#{application.id}</dd></div><div className="flex justify-between gap-3"><dt className="text-ws-muted">Job ID</dt><dd className="font-medium text-ws-fg">#{application.jobId}</dd></div><div className="flex justify-between gap-3"><dt className="text-ws-muted">Last update</dt><dd className="font-medium text-ws-fg">{formatDate(application.createdAt)}</dd></div></dl></section>
      </aside>
    </div>
  </div>;
}

const stages = ["Submitted", "Review", "AI interview", "Final review", "Decision"];
function ApplicationTimeline({ status }: { status: JobApplicationStatus }) {
  const index = stageIndex(status);
  const closed = ["REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(status);
  return <div className="mt-7 grid grid-cols-5">{stages.map((stage, stageIndexValue) => { const complete = stageIndexValue <= index; return <div key={stage} className="relative text-center"><div className={`absolute left-0 right-0 top-4 h-0.5 ${stageIndexValue <= index ? "bg-primary" : "ws-track-rest"}`} /><span className={`relative mx-auto flex size-8 items-center justify-center rounded-full text-xs font-bold ${complete ? closed && stageIndexValue === index ? "bg-chip-alert text-chip-alert-fg" : "bg-primary text-primary-foreground" : "bg-ws-panel text-ws-faint"}`}>{stageIndexValue < index ? <Check className="size-4" /> : stageIndexValue + 1}</span><p className={`mt-2 text-[10px] font-medium sm:text-xs ${complete ? "text-ws-fg" : "text-ws-faint"}`}>{stage}</p></div>; })}</div>;
}
function stageIndex(status: JobApplicationStatus) { if (status === "SUBMITTED") return 0; if (status === "UNDER_REVIEW") return 1; if (status.includes("AI_INTERVIEW")) return 2; if (["MODERATOR_REVIEW_PENDING", "SHORTLISTED", "HUMAN_INTERVIEW_SCHEDULED"].includes(status)) return 3; return 4; }
function displayStatus(status: JobApplicationStatus) { const label = status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); if (["HIRED", "SHORTLISTED", "AI_INTERVIEW_PASSED"].includes(status)) return { label, className: "bg-chip-soft text-chip-soft-fg" }; if (["REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(status)) return { label, className: "bg-chip-alert text-chip-alert-fg" }; return { label, className: "bg-chip-quiet text-chip-quiet-fg" }; }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Recently" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date); }
