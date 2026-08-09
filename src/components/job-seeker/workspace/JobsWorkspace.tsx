"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Chip,
  GhostChip,
  Panel,
  PillTabs,
} from "@/components/workspace/primitives";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { Markdown } from "@/components/shared/Markdown";
import type { PublicJobResponse } from "@/contracts/api/public";
import type {
  JobApplicationResponse,
  ResumeResponse,
} from "@/contracts/api/job-seeker";
import { cn } from "@/lib/utils";
import {
  useApplyToJobMutation,
  useCreateAiInterviewForApplicationMutation,
  useCreateAiInterviewForJobMutation,
} from "@/services/jobSeekerApi";

type JobsWorkspaceProps = {
  jobs: PublicJobResponse[];
  resumes: ResumeResponse[];
  applications: JobApplicationResponse[];
  /** Seeded from `?q=` so the shell's search box lands here with its query. */
  initialKeyword?: string;
};

const workModeTabs = ["All", "Remote", "Hybrid", "Onsite"] as const;
type WorkModeTab = (typeof workModeTabs)[number];

export function JobsWorkspace({
  jobs,
  resumes,
  applications,
  initialKeyword = "",
}: JobsWorkspaceProps) {
  useSetPageHeading("Find jobs");

  const [keyword, setKeyword] = useState(initialKeyword);
  const [workMode, setWorkMode] = useState<WorkModeTab>("All");
  const [selectedId, setSelectedId] = useState<number | null>(
    jobs[0]?.id ?? null,
  );

  const visibleJobs = useMemo(() => {
    const needle = keyword.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesKeyword =
        !needle ||
        job.title.toLowerCase().includes(needle) ||
        job.companyName.toLowerCase().includes(needle) ||
        job.location?.toLowerCase().includes(needle) ||
        job.skills.some((skill) =>
          skill.skillName.toLowerCase().includes(needle),
        );

      const matchesMode =
        workMode === "All" ||
        job.workMode?.toUpperCase().replace(/[\s_-]/g, "") ===
          workMode.toUpperCase();

      return matchesKeyword && matchesMode;
    });
  }, [jobs, keyword, workMode]);

  /* Keep the detail pane on a job that is still in the filtered list. */
  const selected =
    visibleJobs.find((job) => job.id === selectedId) ?? visibleJobs[0] ?? null;

  const applicationByJob = useMemo(
    () => new Map(applications.map((item) => [item.jobId, item])),
    [applications],
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-2 rounded-full bg-ws-card px-4 py-3 text-sm text-ws-muted focus-within:bg-ws-card-hover">
          <Search aria-hidden="true" className="size-4 shrink-0" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search roles, companies, skills"
            className="w-full bg-transparent text-ws-fg outline-none placeholder:text-ws-faint"
          />
          {keyword ? (
            <button
              type="button"
              onClick={() => setKeyword("")}
              aria-label="Clear search"
              className="shrink-0 text-ws-faint hover:text-ws-fg"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          ) : null}
          <span className="sr-only">Search published jobs</span>
        </label>

        <PillTabs tabs={workModeTabs} value={workMode} onChange={setWorkMode} />

        <p className="px-1 text-xs text-ws-faint">
          {visibleJobs.length} {visibleJobs.length === 1 ? "role" : "roles"}
        </p>

        <ul className="ws-scroll flex max-h-136 flex-col gap-2 overflow-y-auto pr-1 xl:max-h-[calc(100vh-19rem)]">
          {visibleJobs.map((job) => (
            <li key={job.id}>
              <JobListRow
                job={job}
                active={job.id === selected?.id}
                applied={applicationByJob.has(job.id)}
                onSelect={() => setSelectedId(job.id)}
              />
            </li>
          ))}

          {!visibleJobs.length ? (
            <Panel className="text-sm text-ws-faint">
              No published roles match that search.
            </Panel>
          ) : null}
        </ul>
      </div>

      {selected ? (
        <JobDetail
          key={selected.id}
          job={selected}
          resumes={resumes}
          application={applicationByJob.get(selected.id)}
        />
      ) : (
        <Panel className="flex items-center justify-center text-sm text-ws-faint">
          Pick a role to see the details.
        </Panel>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- list --- */

function JobListRow({
  job,
  active,
  applied,
  onSelect,
}: {
  job: PublicJobResponse;
  active: boolean;
  applied: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className={cn(
        "w-full rounded-[20px] p-4 text-left transition-colors",
        active ? "bg-chip-soft text-chip-soft-fg" : "bg-ws-card hover:bg-ws-card-hover",
      )}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{job.title}</p>
          <p className="truncate text-xs opacity-70">{job.companyName}</p>
        </div>
        {applied ? <Chip tone="solid">Applied</Chip> : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] opacity-80">
        {job.location ? (
          <span className="inline-flex items-center gap-1">
            <MapPin aria-hidden="true" className="size-3" />
            {job.location}
          </span>
        ) : null}
        {job.workMode ? <span>· {humanize(job.workMode)}</span> : null}
        {job.jobType ? <span>· {humanize(job.jobType)}</span> : null}
      </div>
    </button>
  );
}

/* --------------------------------------------------------------- detail --- */

function JobDetail({
  job,
  resumes,
  application,
}: {
  job: PublicJobResponse;
  resumes: ResumeResponse[];
  application?: JobApplicationResponse;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <GhostChip>
              <Building2 aria-hidden="true" className="size-3.5" />
              {job.companyName}
            </GhostChip>
            {job.categoryName ? <GhostChip>{job.categoryName}</GhostChip> : null}
            {application ? (
              <Chip tone="solid">{humanize(application.status)}</Chip>
            ) : null}
          </div>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ws-fg lg:text-4xl">
            {job.title}
          </h2>
        </div>

        {job.salaryMin ? (
          <p className="text-right">
            <span className="block text-xs text-ws-faint">Salary</span>
            <span className="text-2xl font-semibold tabular-nums text-ws-fg">
              {money(job.salaryMin)}
              {job.salaryMax ? ` – ${money(job.salaryMax)}` : "+"}
            </span>
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {[job.workMode, job.jobType, job.experienceLevel, job.location]
          .filter(Boolean)
          .map((value) => (
            <GhostChip key={value} className="px-3 py-2">
              {humanize(value)}
            </GhostChip>
          ))}
      </div>

      <AiInterviewPanel job={job} application={application} />

      <ApplyPanel job={job} resumes={resumes} application={application} />

      {job.skills.length ? (
        <Panel>
          <h3 className="mb-3 text-[15px] font-semibold">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Chip key={skill.id} tone="quiet">
                {skill.skillName}
                {skill.requiredLevel ? (
                  <span className="opacity-60">{humanize(skill.requiredLevel)}</span>
                ) : null}
              </Chip>
            ))}
          </div>
        </Panel>
      ) : null}

      {job.description ? (
        <Panel>
          <h3 className="mb-3 text-[15px] font-semibold">About the role</h3>
          <Markdown content={job.description} />
        </Panel>
      ) : null}

      {job.sections.map((section) => (
        <Panel key={section.id}>
          <h3 className="mb-3 text-[15px] font-semibold">{section.title}</h3>
          <Markdown content={section.contentMarkdown || section.contentText} />
        </Panel>
      ))}
    </div>
  );
}

/* -------------------------------------------------------- ai interviews --- */

/**
 * The AI interview entry point. Once an application exists the session is tied
 * to it — that is the one the recruiter sees — so the practice run is only
 * offered before applying.
 */
function AiInterviewPanel({
  job,
  application,
}: {
  job: PublicJobResponse;
  application?: JobApplicationResponse;
}) {
  const router = useRouter();
  const [createForJob, jobCreation] = useCreateAiInterviewForJobMutation();
  const [createForApplication, applicationCreation] =
    useCreateAiInterviewForApplicationMutation();

  const pending = jobCreation.isLoading || applicationCreation.isLoading;

  const start = async () => {
    try {
      const session = application
        ? await createForApplication(application.id).unwrap()
        : await createForJob(job.id).unwrap();

      router.push(`/job-seeker/interviews/${session.id}`);
    } catch {
      toast.error("Unable to start an AI interview for this role.");
    }
  };

  return (
    <Panel tone="soft" className="flex flex-wrap items-center gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-chip-solid text-chip-solid-fg">
        <Sparkles aria-hidden="true" className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-semibold">
          {application ? "Interview for this application" : "Practise this interview"}
        </h3>
        <p className="text-sm opacity-70">
          {application
            ? "Answer the generated questions and the recruiter sees your score."
            : "A scored mock round, generated from this job post. It does not apply you."}
        </p>
      </div>

      <button
        type="button"
        onClick={start}
        disabled={pending}
        className="flex items-center gap-2 rounded-full bg-ws-fg px-5 py-3 text-sm font-semibold text-ws-panel transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-50"
      >
        {pending ? "Preparing…" : "Start AI interview"}
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>
    </Panel>
  );
}

/* ---------------------------------------------------------------- apply --- */

function ApplyPanel({
  job,
  resumes,
  application,
}: {
  job: PublicJobResponse;
  resumes: ResumeResponse[];
  application?: JobApplicationResponse;
}) {
  const defaultResume = resumes.find((resume) => resume.isDefault) ?? resumes[0];
  const [resumeId, setResumeId] = useState(
    defaultResume ? String(defaultResume.id) : "",
  );
  const [coverLetter, setCoverLetter] = useState("");
  const [apply, submission] = useApplyToJobMutation();

  if (application) {
    return (
      <Panel className="flex flex-wrap items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-chip-solid text-chip-solid-fg">
          <Check aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Applied {formatDate(application.appliedAt)}</p>
          <p className="text-xs text-ws-faint">
            {application.resumeTitle || "No resume attached"}
          </p>
        </div>
        <Chip tone="quiet">{humanize(application.status)}</Chip>
      </Panel>
    );
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await apply({
        jobId: job.id,
        body: {
          resumeId: resumeId ? Number(resumeId) : undefined,
          coverLetter: coverLetter.trim() || undefined,
        },
      }).unwrap();
      toast.success("Application submitted.");
      setCoverLetter("");
    } catch {
      toast.error("Unable to submit the application.");
    }
  };

  return (
    <Panel>
      <h3 className="mb-4 flex items-center gap-2 text-[15px] font-semibold">
        <Briefcase aria-hidden="true" className="size-4" />
        Apply
      </h3>

      <form className="flex flex-col gap-3" onSubmit={submit}>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted">
          Resume
          <select
            value={resumeId}
            onChange={(event) => setResumeId(event.target.value)}
            className="rounded-2xl bg-ws-card-hover px-4 py-3 text-sm text-ws-fg outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="">No resume</option>
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.title}
                {resume.isDefault ? " (default)" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted">
          Cover letter
          <textarea
            value={coverLetter}
            onChange={(event) => setCoverLetter(event.target.value)}
            maxLength={5000}
            rows={4}
            placeholder="Optional — why you are a fit for this role"
            className="resize-y rounded-2xl bg-ws-card-hover px-4 py-3 text-sm text-ws-fg outline-none placeholder:text-ws-faint focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>

        <button
          type="submit"
          disabled={submission.isLoading}
          className="mt-1 self-start rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-50"
        >
          {submission.isLoading ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </Panel>
  );
}

/* -------------------------------------------------------------- helpers --- */

function humanize(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .join(" ")
    .replace(/^./, (character) => character.toUpperCase());
}

function money(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
