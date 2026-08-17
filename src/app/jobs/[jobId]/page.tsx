"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft, BriefcaseBusiness, Building2, MapPin } from "lucide-react";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { GhostChip, Panel, PanelHeader } from "@/components/workspace/primitives";
import { formatDate, humanizeEnum, orDash } from "@/lib/format";
import { useGetPublicJobQuery } from "@/services/jobsApi";

export default function JobDetailPage({ params }: PageProps<"/jobs/[jobId]">) {
  const { jobId } = use(params);
  const id = Number(jobId);
  const { data: job, isLoading, isError, refetch } = useGetPublicJobQuery(id, { skip: !Number.isFinite(id) });
  useSetPageHeading(job?.title ?? "Job details");

  if (!Number.isFinite(id)) return <ErrorState message="This job ID is invalid." />;
  if (isLoading) return <Panel><LoadingState rows={7} /></Panel>;
  if (isError || !job) return <ErrorState message="Unable to load this published job." onRetry={refetch} />;

  const sections = [...(job.sections ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="flex flex-col gap-5">
      <Link href="/jobs" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-ws-muted hover:text-ws-fg">
        <ArrowLeft aria-hidden="true" className="size-4" /> Back to jobs
      </Link>
      <Panel>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-chip-soft text-chip-soft-fg">
            <BriefcaseBusiness aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold tracking-tight">{job.title}</h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-ws-muted"><Building2 aria-hidden="true" className="size-4" />{orDash(job.companyName)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <GhostChip><MapPin aria-hidden="true" className="size-3" />{orDash(job.location)}</GhostChip>
              <GhostChip>{orDash(job.categoryName)}</GhostChip>
              {job.jobType ? <GhostChip>{humanizeEnum(job.jobType)}</GhostChip> : null}
              {job.workMode ? <GhostChip>{humanizeEnum(job.workMode)}</GhostChip> : null}
              {job.experienceLevel ? <GhostChip>{humanizeEnum(job.experienceLevel)}</GhostChip> : null}
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex flex-col gap-5">
          <Panel>
            <PanelHeader title="Description" />
            <p className="whitespace-pre-wrap text-sm leading-7 text-ws-muted">{orDash(job.description)}</p>
          </Panel>
          {sections.map((section) => (
            <Panel key={section.id}>
              <PanelHeader title={section.title || humanizeEnum(section.sectionType)} />
              <p className="whitespace-pre-wrap text-sm leading-7 text-ws-muted">{section.contentText || section.contentMarkdown}</p>
            </Panel>
          ))}
        </div>
        <div className="flex flex-col gap-5">
          <Panel>
            <PanelHeader title="Posting details" />
            <dl className="space-y-3 text-sm">
              <Detail label="Salary" value={formatSalary(job.salaryMin, job.salaryMax)} />
              <Detail label="Published" value={formatDate(job.publishedAt)} />
              <Detail label="Expires" value={formatDate(job.expiredAt)} />
            </dl>
          </Panel>
          <Panel>
            <PanelHeader title="Skills" />
            {job.skills?.length ? <div className="flex flex-wrap gap-2">{job.skills.map((skill) => <GhostChip key={skill.id}>{skill.skillName}{skill.requiredLevel ? ` · ${humanizeEnum(skill.requiredLevel)}` : ""}</GhostChip>)}</div> : <p className="text-sm text-ws-faint">No skills listed.</p>}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4"><dt className="text-ws-faint">{label}</dt><dd className="text-right font-medium text-ws-fg">{value}</dd></div>;
}

function formatSalary(min: number | null, max: number | null) {
  if (min == null && max == null) return "Not disclosed";
  const format = (value: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
  if (min != null && max != null) return `${format(min)} – ${format(max)}`;
  return min != null ? `From ${format(min)}` : `Up to ${format(max!)}`;
}
