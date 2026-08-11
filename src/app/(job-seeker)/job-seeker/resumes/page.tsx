"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FilePlus2, FileText, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ResumeResponse } from "@/contracts";
import { ResumeDocument } from "@/components/job-seeker/ResumeDocument";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useDeleteResumeMutation, useGetResumesQuery, useSetDefaultResumeMutation } from "@/services/jobSeekerApi";

type Filter = "ALL" | "DEFAULT" | "HAS_FILE" | "DRAFT";

export default function ResumesPage() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [newestFirst, setNewestFirst] = useState(true);
  const query = useGetResumesQuery();
  const [setDefault, defaultState] = useSetDefaultResumeMutation();
  const [deleteResume, deleteState] = useDeleteResumeMutation();
  const resumes = useMemo(() => query.data ?? [], [query.data]);
  const visible = useMemo(() => resumes.filter((resume) => {
    if (filter === "DEFAULT") return resume.isDefault;
    if (filter === "HAS_FILE") return Boolean(resume.resumeFileUrl);
    if (filter === "DRAFT") return !resume.resumeFileUrl && !hasContent(resume);
    return true;
  }).sort((a, b) => (new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) * (newestFirst ? 1 : -1)), [filter, newestFirst, resumes]);

  if (query.isLoading) return <LoadingState rows={5} />;
  if (query.isError) return <ErrorState message="Unable to load resumes." />;

  async function makeDefault(resume: ResumeResponse) {
    if (resume.isDefault) return;
    try { await setDefault(resume.id).unwrap(); toast.success(`“${resume.title}” is now your default resume`); } catch { toast.error("Could not update your default resume."); }
  }
  async function remove(resume: ResumeResponse) {
    if (!window.confirm(`Delete “${resume.title}”? This cannot be undone.`)) return;
    try { await deleteResume(resume.id).unwrap(); toast.success("Resume deleted"); } catch { toast.error("Could not delete this resume."); }
  }

  return <div className="mx-auto max-w-6xl">
    <PageIntro title="Resumes" description="Manage and organize your resumes." />

    <div className="mb-6 flex justify-end"><Link href="/job-seeker/resumes/new" className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-brand-hover"><FilePlus2 className="size-5" /> Create new resume</Link></div>

    <div className="mb-7 flex flex-col gap-4 border-b border-ws-line sm:flex-row sm:items-end sm:justify-between">
      <div className="flex gap-8 overflow-x-auto">{(["ALL", "DEFAULT", "HAS_FILE", "DRAFT"] as Filter[]).map((item) => <button key={item} onClick={() => setFilter(item)} className={`relative px-1 pb-4 text-sm font-semibold transition ${filter === item ? "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary" : "text-ws-muted hover:text-ws-fg"}`}>{item === "HAS_FILE" ? "Has file" : item.charAt(0) + item.slice(1).toLowerCase()}</button>)}</div>
      <label className="mb-3 flex items-center gap-3 text-sm text-ws-muted">Sort by:<select value={newestFirst ? "newest" : "oldest"} onChange={(e) => setNewestFirst(e.target.value === "newest")} className="bg-transparent font-semibold text-ws-fg outline-none"><option value="newest">Newest</option><option value="oldest">Oldest</option></select></label>
    </div>

    {visible.length ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{visible.map((resume) => <article key={resume.id} className={`group relative overflow-hidden rounded-2xl border bg-ws-panel p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] ${resume.isDefault ? "border-primary" : "border-ws-line"}`}>
      {resume.isDefault ? <span className="absolute right-4 top-4 z-10 rounded-lg bg-chip-soft px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-chip-soft-fg">Default</span> : null}
      <Link href={`/job-seeker/resumes/${resume.id}`} className="block">
        <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-xl bg-ws-card-hover p-4">
          {resume.resumeFileUrl ? <iframe src={`${resume.resumeFileUrl}#page=1&view=Fit&zoom=page-fit&toolbar=0&navpanes=0&scrollbar=0`} title={`${resume.title} preview`} tabIndex={-1} scrolling="no" className="pointer-events-none size-full border-0 bg-white shadow-sm" /> : hasContent(resume) ? <div className="flex size-full items-center justify-center overflow-hidden bg-[#292929]"><div className="relative h-[220px] w-[156px] shrink-0 overflow-hidden bg-white shadow-sm"><div className="absolute left-0 top-0 w-[595px] origin-top-left scale-[0.262]"><ResumeDocument title={resume.title} data={resume.resumeData} /></div></div></div> : <FileText className="size-12 text-ws-faint" />}
        </div>
        <h2 className="mt-5 truncate text-base font-semibold text-ws-fg">{resume.title}</h2>
        <p className="mt-2 flex items-center gap-2 text-sm text-ws-muted"><span className={`size-2 rounded-full ${resume.resumeFileUrl || hasContent(resume) ? "bg-primary" : "bg-warning"}`} /> {resume.resumeFileUrl ? "File attached" : hasContent(resume) ? "Profile completed" : "Draft"}</p>
      </Link>
      <div className="mt-4 flex items-center justify-between gap-2"><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${resume.resumeFileUrl || hasContent(resume) ? "bg-chip-soft text-chip-soft-fg" : "bg-chip-quiet text-chip-quiet-fg"}`}>{resume.resumeFileUrl || hasContent(resume) ? "Complete" : "Draft"}</span><span className="text-xs text-ws-muted">Updated {formatDate(resume.updatedAt)}</span></div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <Link href={`/job-seeker/resumes/${resume.id}`} aria-label={`Edit ${resume.title}`} className="flex h-11 items-center justify-center rounded-xl border border-ws-line text-ws-muted hover:border-primary hover:text-primary"><Pencil className="size-4" /></Link>
        <button onClick={() => void remove(resume)} disabled={deleteState.isLoading} aria-label={`Delete ${resume.title}`} className="flex h-11 items-center justify-center rounded-xl border border-ws-line text-ws-muted hover:border-destructive hover:text-destructive disabled:opacity-50"><Trash2 className="size-4" /></button>
        <button onClick={() => void makeDefault(resume)} disabled={resume.isDefault || defaultState.isLoading} aria-label={resume.isDefault ? "Default resume" : `Make ${resume.title} default`} className={`flex h-11 items-center justify-center rounded-xl border transition disabled:opacity-60 ${resume.isDefault ? "border-primary/30 bg-chip-soft text-primary" : "border-ws-line text-ws-muted hover:border-primary hover:text-primary"}`}><Star className={`size-4 ${resume.isDefault ? "fill-current" : ""}`} /></button>
      </div>
    </article>)}</div> : <div className="rounded-xl border border-dashed border-ws-line bg-ws-card px-6 py-16 text-center"><FileText className="mx-auto size-10 text-ws-faint" /><h2 className="mt-4 font-semibold text-ws-fg">No resumes in this view</h2><p className="mt-2 text-sm text-ws-muted">Choose another filter or create a new resume.</p></div>}
  </div>;
}

function hasContent(resume: ResumeResponse) { return Object.values(resume.resumeData ?? {}).some((value) => typeof value === "string" && value.trim()); }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "recently" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date); }
