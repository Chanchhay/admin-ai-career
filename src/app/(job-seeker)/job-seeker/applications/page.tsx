"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, FileSearch, Search, Send, XCircle } from "lucide-react";
import type { JobApplicationStatus } from "@/contracts";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetApplicationsQuery } from "@/services/jobSeekerApi";

type Filter = "ALL" | "ACTIVE" | "SUCCESS" | "CLOSED";

export default function ApplicationsPage() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [search, setSearch] = useState("");
  const query = useGetApplicationsQuery();
  const applications = useMemo(() => query.data ?? [], [query.data]);
  const filtered = useMemo(() => applications.filter((application) => {
    const matchesSearch = application.jobTitle.toLowerCase().includes(search.trim().toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "SUCCESS") return ["SHORTLISTED", "HUMAN_INTERVIEW_SCHEDULED", "HIRED"].includes(application.status);
    if (filter === "CLOSED") return ["REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(application.status);
    if (filter === "ACTIVE") return !["HIRED", "REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(application.status);
    return true;
  }), [applications, filter, search]);

  if (query.isLoading) return <LoadingState rows={5} />;
  if (query.isError) return <ErrorState message="Unable to load applications." />;
  const active = applications.filter((item) => !["HIRED", "REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(item.status)).length;
  const interviews = applications.filter((item) => item.status.includes("INTERVIEW")).length;
  const offers = applications.filter((item) => item.status === "HIRED").length;

  return <div className="mx-auto max-w-6xl">
    <PageIntro title="My applications" description="Follow every opportunity from submission to final decision." />
    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      <Metric icon={Send} label="Total applications" value={applications.length} />
      <Metric icon={Clock3} label="In progress" value={active} />
      <Metric icon={interviews ? CalendarDays : CheckCircle2} label="Interviews / hired" value={`${interviews} / ${offers}`} />
    </div>

    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-1 overflow-x-auto rounded-xl bg-ws-card p-1">{(["ALL", "ACTIVE", "SUCCESS", "CLOSED"] as Filter[]).map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-lg px-3.5 py-2 text-xs font-semibold capitalize transition ${filter === item ? "bg-ws-panel text-ws-fg shadow-sm" : "text-ws-muted hover:text-ws-fg"}`}>{item.toLowerCase()}</button>)}</div>
      <label className="flex h-11 items-center gap-2 rounded-xl bg-ws-card px-3.5 text-ws-muted"><Search className="size-4" /><span className="sr-only">Search applications</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by job title" className="w-full bg-transparent text-sm text-ws-fg outline-none placeholder:text-ws-faint sm:w-60" /></label>
    </div>

    {filtered.length ? <div className="space-y-3">{filtered.map((application) => { const status = statusInfo(application.status); return <Link key={application.id} href={`/job-seeker/applications/${application.id}`} className="group grid gap-4 rounded-[20px] bg-ws-card p-5 transition hover:bg-ws-card-hover sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="flex size-12 items-center justify-center rounded-2xl bg-ws-panel text-primary shadow-sm"><BriefcaseBusiness className="size-5" /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate font-semibold text-ws-fg">{application.jobTitle}</h2><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}>{status.label}</span></div><div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ws-muted"><span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" /> Applied {formatDate(application.appliedAt || application.createdAt)}</span><span className="flex items-center gap-1.5"><FileSearch className="size-3.5" /> {application.resumeTitle || "Resume attached"}</span></div></div><ArrowUpRight className="hidden size-5 text-ws-faint transition group-hover:text-primary sm:block" /></Link>; })}</div> : <div className="rounded-[24px] bg-ws-card px-6 py-16 text-center"><XCircle className="mx-auto size-10 text-ws-faint" /><h2 className="mt-4 font-semibold text-ws-fg">No applications found</h2><p className="mt-2 text-sm text-ws-muted">Try another filter or explore new opportunities.</p><Link href="/job-seeker/jobs" className="mt-5 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Browse jobs</Link></div>}
  </div>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof Send; label: string; value: string | number }) { return <div className="flex items-center gap-4 rounded-[20px] bg-ws-card p-5"><span className="flex size-11 items-center justify-center rounded-xl bg-chip-soft text-chip-soft-fg"><Icon className="size-5" /></span><div><p className="text-2xl font-semibold text-ws-fg">{value}</p><p className="mt-0.5 text-xs text-ws-muted">{label}</p></div></div>; }
function statusInfo(status: JobApplicationStatus) { if (["HIRED", "SHORTLISTED", "AI_INTERVIEW_PASSED"].includes(status)) return { label: status === "HIRED" ? "Hired" : status === "SHORTLISTED" ? "Shortlisted" : "Interview passed", className: "bg-chip-soft text-chip-soft-fg" }; if (["REJECTED", "WITHDRAWN", "AI_INTERVIEW_FAILED"].includes(status)) return { label: status.replaceAll("_", " ").toLowerCase(), className: "bg-chip-alert text-chip-alert-fg capitalize" }; return { label: status.replaceAll("_", " ").toLowerCase(), className: "bg-chip-quiet text-chip-quiet-fg capitalize" }; }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Recently" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date); }
