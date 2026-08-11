"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CalendarDays, Check, Download, Eye, FileText, Loader2, Pencil, Shield, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ResumeDocument } from "@/components/job-seeker/ResumeDocument";
import { ResumeForm } from "@/components/job-seeker/ResumeForm";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { useDeleteResumeMutation, useGetResumeQuery, useSetDefaultResumeMutation, useUpdateResumeMutation } from "@/services/jobSeekerApi";

export default function ResumeDetailPage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const resumeQuery = useGetResumeQuery(resumeId);
  const [setDefault, defaultState] = useSetDefaultResumeMutation();
  const [updateResume, updateState] = useUpdateResumeMutation();
  const [deleteResume, deleteState] = useDeleteResumeMutation();

  if (resumeQuery.isLoading) return <LoadingState rows={4} />;
  if (resumeQuery.isError || !resumeQuery.data) return <ErrorState message="Unable to load this resume." />;
  const resume = resumeQuery.data;

  async function makeDefault() {
    try {
      await setDefault(resumeId).unwrap();
      toast.success("Default resume updated");
    } catch { toast.error("Could not update your default resume."); }
  }

  async function removeResume() {
    if (!window.confirm(`Delete “${resume.title}”? This cannot be undone.`)) return;
    try {
      await deleteResume(resumeId).unwrap();
      toast.success("Resume deleted");
      router.replace("/job-seeker/resumes");
    } catch { toast.error("Could not delete this resume."); }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={resume.title} description="Review and manage this resume." />
      <Link href="/job-seeker/resumes" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-ws-muted hover:text-ws-fg"><ArrowLeft className="size-4" /> All resumes</Link>

      {isEditing ? (
        <div className="mx-auto max-w-3xl rounded-[24px] bg-ws-card p-6 lg:p-8">
          <div className="mb-7"><p className="text-xs font-semibold uppercase tracking-widest text-primary">Edit document</p><h2 className="mt-2 text-xl font-semibold text-ws-fg">Update resume details</h2></div>
          <ResumeForm
            mode="builder"
            initialTitle={resume.title}
            initialFileUrl={resume.resumeFileUrl}
            initialResumeData={resume.resumeData}
            submitLabel="Save changes"
            isSubmitting={updateState.isLoading}
            onCancel={() => setIsEditing(false)}
            onSubmit={async (body) => {
              try {
                await updateResume({ resumeId, body }).unwrap();
                toast.success("Resume updated");
                setIsEditing(false);
              } catch { toast.error("Could not save your changes."); }
            }}
          />
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.45fr_0.75fr]">
          <section className="overflow-hidden rounded-[24px] bg-ws-card">
            <div className="flex min-h-105 items-center justify-center bg-ws-card-hover p-8 sm:p-12">
              {resume.resumeFileUrl ? (
                <div className="aspect-[0.707] w-full max-w-105 overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
                  <iframe
                    src={`${resume.resumeFileUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                    title={`${resume.title} preview`}
                    className="size-full border-0"
                  />
                </div>
              ) : hasResumeContent(resume.resumeData) ? <ResumeDocument title={resume.title} data={resume.resumeData} compact /> : <div className="relative flex aspect-[0.72] w-full max-w-65 flex-col rounded-sm bg-white p-7 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
                <div className="h-3 w-2/3 rounded-full bg-slate-800" />
                <div className="mt-3 h-1.5 w-1/2 rounded-full bg-slate-300" />
                <div className="mt-8 grid gap-2"><span className="h-1 rounded bg-slate-200"/><span className="h-1 rounded bg-slate-200"/><span className="h-1 w-5/6 rounded bg-slate-200"/></div>
                <div className="mt-7 h-2 w-1/3 rounded-full bg-primary/70" />
                <div className="mt-3 flex-1 ws-paper opacity-60" />
                <FileText className="absolute bottom-5 right-5 size-5 text-slate-300" />
              </div>}
            </div>
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="min-w-0"><h2 className="truncate text-lg font-semibold text-ws-fg">{resume.title}</h2><p className="mt-1 text-sm text-ws-muted">PDF document</p></div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setIsEditing(true)} className="rounded-xl"><Pencil /> Edit</Button>
                {resume.resumeFileUrl ? <Button render={<a href={resume.resumeFileUrl} target="_blank" rel="noreferrer" />} className="rounded-xl"><Download /> View PDF</Button> : <Button render={<Link href={`/job-seeker/resumes/${resume.id}/view`} />} className="rounded-xl"><Eye /> View resume</Button>}
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-[22px] bg-ws-card p-5">
              <h2 className="text-sm font-semibold text-ws-fg">Resume status</h2>
              <div className="mt-5 space-y-4">
                <InfoRow icon={resume.isDefault ? Check : Star} label="Application default" value={resume.isDefault ? "Default resume" : "Not default"} active={resume.isDefault} />
                <InfoRow icon={Shield} label="Visibility" value={resume.visibility?.toLowerCase() ?? "private"} />
                <InfoRow icon={CalendarDays} label="Last updated" value={formatDate(resume.updatedAt)} />
              </div>
              {!resume.isDefault ? <Button onClick={makeDefault} disabled={defaultState.isLoading} variant="secondary" className="mt-6 w-full rounded-xl">{defaultState.isLoading ? <Loader2 className="animate-spin" /> : <Star />} Make default</Button> : null}
            </section>

            <section className="rounded-[22px] bg-ws-card p-5">
              <h2 className="text-sm font-semibold text-ws-fg">Document actions</h2>
              <p className="mt-2 text-xs leading-5 text-ws-muted">Deleting removes this resume from your library and future applications.</p>
              <Button variant="destructive" onClick={removeResume} disabled={deleteState.isLoading} className="mt-5 w-full rounded-xl">{deleteState.isLoading ? <Loader2 className="animate-spin" /> : <Trash2 />} Delete resume</Button>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, active }: { icon: typeof Star; label: string; value: string; active?: boolean }) {
  return <div className="flex items-center gap-3"><span className={`flex size-9 items-center justify-center rounded-xl ${active ? "bg-chip-soft text-chip-soft-fg" : "bg-ws-panel text-ws-muted"}`}><Icon className="size-4" /></span><div><p className="text-xs text-ws-muted">{label}</p><p className="mt-0.5 text-sm font-medium capitalize text-ws-fg">{value}</p></div></div>;
}

function formatDate(value?: string) {
  if (!value) return "Recently";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recently" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function hasResumeContent(data: Record<string, unknown>) {
  return Object.values(data ?? {}).some((value) => typeof value === "string" && value.trim());
}
