"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Briefcase,
  Check,
  CircleUserRound,
  Eye,
  FileText,
  Flag,
  FolderKanban,
  MapPin,
  Mail,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Sparkles,
  Wallet,
} from "lucide-react";
import {
  Chip,
  FileCard,
  GhostChip,
  IconAction,
  Panel,
  PanelHeader,
  PillTabs,
  PipelineTrack,
  type Tone,
} from "@/components/workspace/primitives";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import type {
  AiInterviewSessionResponse,
  JobApplicationResponse,
  JobApplicationStatus,
  JobSeekerProfileResponse,
  PortfolioResponse,
  ResumeResponse,
} from "@/contracts/api/job-seeker";
import type { CurrentUserResponse } from "@/contracts/api/auth";
import { cn } from "@/lib/utils";

type OverviewWorkspaceProps = {
  user?: CurrentUserResponse;
  profile: JobSeekerProfileResponse;
  resumes: ResumeResponse[];
  portfolios: PortfolioResponse[];
  applications: JobApplicationResponse[];
  interviews: AiInterviewSessionResponse[];
};

export function OverviewWorkspace({
  user,
  profile,
  resumes,
  portfolios,
  applications,
  interviews,
}: OverviewWorkspaceProps) {
  const name = user?.fullName || "My workspace";
  useSetPageHeading(name);

  const stage = groupByStage(applications);

  return (
    <div className="flex flex-col gap-5">
      <Hero
        name={name}
        profile={profile}
        applications={applications}
        hired={stage.hired.length}
        closed={stage.closed.length}
      />

      <PipelineTrack
        segments={[
          { label: "In review", count: stage.review.length, tone: "soft" },
          { label: "Interviewing", count: stage.interview.length, tone: "solid" },
          { label: "Offers", count: stage.hired.length, tone: "quiet" },
        ]}
        restLabel={`${stage.closed.length} closed`}
      />

      {/*
       * Three columns that stack, not a grid of equal metric tiles: identity on
       * the left, the working stream in the middle, documents on the right.
       */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_minmax(0,19rem)]">
        <div className="flex flex-col gap-5">
          <DetailsNote name={name} user={user} profile={profile} />
          <ExpectationsNote profile={profile} />
        </div>

        <ActivityStream
          applications={applications}
          interviews={interviews}
          portfolios={portfolios}
        />

        <FilesColumn resumes={resumes} portfolios={portfolios} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- hero --- */

function Hero({
  name,
  profile,
  applications,
  hired,
  closed,
}: {
  name: string;
  profile: JobSeekerProfileResponse;
  applications: JobApplicationResponse[];
  hired: number;
  closed: number;
}) {
  const latest = [...applications].sort(
    (a, b) => date(b.appliedAt) - date(a.appliedAt),
  )[0];

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-ws-muted">{name}</span>
          {profile.availabilityStatus ? (
            <Chip tone="solid">{humanize(profile.availabilityStatus)}</Chip>
          ) : null}
          <GhostChip>{humanize(profile.profileVisibility)} profile</GhostChip>
        </div>

        {/* The headline number, sized like a balance — the page's single anchor. */}
        <p className="mt-1 flex items-baseline gap-2 text-ws-fg">
          <span className="text-5xl font-semibold tracking-tight tabular-nums lg:text-6xl">
            {applications.length}
          </span>
          <span className="text-xl font-medium text-ws-faint lg:text-2xl">
            applications
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip tone="solid" className="px-4 py-2 text-sm">
          {hired} won
        </Chip>
        <Chip tone="alert" className="px-4 py-2 text-sm">
          {closed} lost
        </Chip>
        <GhostChip className="px-3 py-2">
          <Flag aria-hidden="true" className="size-3.5" />
          {latest ? formatDate(latest.appliedAt) : "No activity yet"}
        </GhostChip>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- sticky notes --- */

function DetailsNote({
  name,
  user,
  profile,
}: {
  name: string;
  user?: CurrentUserResponse;
  profile: JobSeekerProfileResponse;
}) {
  const rows = [
    { icon: CircleUserRound, label: "Name", value: name },
    {
      icon: Briefcase,
      label: "Position",
      value: profile.currentPosition || profile.headline || "Not set",
    },
    { icon: Mail, label: "Email", value: user?.email ?? "Not set" },
    { icon: Phone, label: "Phone", value: user?.phoneNumber || "Not set" },
    {
      icon: MapPin,
      label: "Location",
      value: profile.preferredLocation || "Anywhere",
    },
  ];

  return (
    <Panel tone="soft">
      <PanelHeader
        title="Details"
        icon={<CircleUserRound aria-hidden="true" className="size-4" />}
        action={
          <IconAction label="Edit profile" href="/job-seeker/profile">
            <Pencil aria-hidden="true" className="size-4" />
          </IconAction>
        }
      />

      <dl className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-2.5">
            <row.icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 opacity-60" />
            <div className="min-w-0">
              <dt className="text-[11px] font-medium uppercase tracking-wide opacity-60">
                {row.label}
              </dt>
              <dd className="truncate text-sm font-semibold">{row.value}</dd>
            </div>
          </div>
        ))}
      </dl>

      {profile.publicProfileSlug ? (
        <Link
          href={`/profile?slug=${profile.publicProfileSlug}`}
          className="mt-5 flex items-center justify-center gap-2 rounded-full bg-ws-fg/10 py-2.5 text-xs font-semibold transition-colors hover:bg-ws-fg/20"
        >
          <Eye aria-hidden="true" className="size-3.5" />
          View public profile
        </Link>
      ) : null}
    </Panel>
  );
}

function ExpectationsNote({ profile }: { profile: JobSeekerProfileResponse }) {
  const currency = profile.expectedSalaryCurrency || "USD";

  return (
    <Panel>
      <PanelHeader
        title="Expectations"
        icon={<Wallet aria-hidden="true" className="size-4" />}
        action={
          <IconAction label="Edit expectations" href="/job-seeker/profile">
            <Pencil aria-hidden="true" className="size-4" />
          </IconAction>
        }
      />

      <p className="text-[11px] font-medium uppercase tracking-wide opacity-60">
        Salary range
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
        {profile.expectedSalaryMin
          ? `${money(profile.expectedSalaryMin, currency)}${
              profile.expectedSalaryMax
                ? ` – ${money(profile.expectedSalaryMax, currency)}`
                : "+"
            }`
          : "Not set"}
      </p>

      <div className="mt-4 flex flex-col gap-1">
        <p className="text-[11px] font-medium uppercase tracking-wide opacity-60">
          Shared with
        </p>
        <p className="text-sm font-semibold">
          {humanize(profile.salaryVisibility ?? "PRIVATE")}
        </p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------ activity stream --- */

const streamTabs = ["Timeline", "Applications", "Interviews"] as const;
type StreamTab = (typeof streamTabs)[number];

function ActivityStream({
  applications,
  interviews,
  portfolios,
}: {
  applications: JobApplicationResponse[];
  interviews: AiInterviewSessionResponse[];
  portfolios: PortfolioResponse[];
}) {
  const [tab, setTab] = useState<StreamTab>("Timeline");
  const stage = groupByStage(applications);

  const applicationRows = [...applications]
    .sort((a, b) => date(b.appliedAt) - date(a.appliedAt))
    .map(applicationRow);

  const interviewRows = interviews.map(interviewRow);

  const sections =
    tab === "Applications"
      ? [
          { heading: "Open", rows: [...stage.review, ...stage.interview].map(applicationRow) },
          { heading: "Closed", rows: [...stage.hired, ...stage.closed].map(applicationRow) },
        ]
      : tab === "Interviews"
        ? [
            {
              heading: "In progress",
              rows: interviewRows.filter((row) => !row.done),
            },
            { heading: "Done", rows: interviewRows.filter((row) => row.done) },
          ]
        : [
            {
              heading: "In progress",
              rows: [...applicationRows, ...interviewRows].filter((row) => !row.done),
            },
            {
              heading: "Done",
              rows: [...applicationRows, ...interviewRows].filter((row) => row.done),
            },
          ];

  return (
    <Panel className="relative flex min-h-104 flex-col p-0">
      {/* Tabs float on the card edge, the way a folder tab sits on a folder. */}
      <div className="flex items-center gap-3 p-3">
        <PillTabs tabs={streamTabs} value={tab} onChange={setTab} />
        <span className="ml-auto hidden shrink-0 pr-2 text-xs text-ws-faint sm:block">
          {portfolios.length} portfolios published
        </span>
      </div>

      <div className="ws-scroll flex-1 overflow-y-auto px-3 pb-24">
        {sections.map((section) =>
          section.rows.length ? (
            <div key={section.heading} className="mb-2">
              <h3 className="px-2 py-3 text-lg font-medium text-ws-fg">
                {section.heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.rows.map((row) => (
                  <StreamRow key={row.key} row={row} />
                ))}
              </ul>
            </div>
          ) : null,
        )}

        {sections.every((section) => !section.rows.length) ? (
          <p className="px-2 py-10 text-center text-sm text-ws-faint">
            Nothing here yet. Apply to a role and it will show up in this stream.
          </p>
        ) : null}
      </div>

      {/* The one call to action, floating clear of the list. */}
      <Link
        href="/job-seeker/jobs"
        className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-ws-fg px-5 py-3 text-sm font-semibold text-ws-panel shadow-(--shadow-dropdown) transition-transform hover:scale-105"
      >
        <Plus aria-hidden="true" className="size-4" />
        Find a new role
      </Link>
    </Panel>
  );
}

type Row = {
  key: string;
  href: string;
  icon: typeof MessageSquare;
  iconTone: Tone;
  title: string;
  meta: string;
  chip: string;
  chipTone: Tone;
  done: boolean;
};

function StreamRow({ row }: { row: Row }) {
  return (
    <li>
      <Link
        href={row.href}
        className="flex items-center gap-3 rounded-[18px] bg-ws-card-hover px-3 py-3 transition-colors hover:bg-ws-panel"
      >
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            row.iconTone === "solid" && "bg-chip-solid text-chip-solid-fg",
            row.iconTone === "soft" && "bg-chip-soft text-chip-soft-fg",
            row.iconTone === "quiet" && "bg-chip-quiet text-chip-quiet-fg",
            row.iconTone === "alert" && "bg-chip-alert text-chip-alert-fg",
          )}
        >
          {row.done ? (
            <Check aria-hidden="true" className="size-4" />
          ) : (
            <row.icon aria-hidden="true" className="size-4" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ws-fg">{row.title}</p>
          <p className="truncate text-xs text-ws-faint">{row.meta}</p>
        </div>

        <Chip tone={row.chipTone} className="shrink-0">
          {row.chip}
        </Chip>
      </Link>
    </li>
  );
}

function applicationRow(application: JobApplicationResponse): Row {
  const stage = stageOf(application.status);
  const tone: Tone =
    stage === "hired" ? "solid" : stage === "closed" ? "alert" : stage === "interview" ? "solid" : "soft";

  return {
    key: `application-${application.id}`,
    href: `/job-seeker/applications/${application.id}`,
    icon: MessageSquare,
    iconTone: tone,
    title: application.jobTitle,
    meta: `${application.resumeTitle || "No resume"} • applied ${formatDate(application.appliedAt)}`,
    chip: humanize(application.status),
    chipTone: tone,
    done: stage === "hired" || stage === "closed",
  };
}

function interviewRow(session: AiInterviewSessionResponse): Row {
  const done = session.status === "COMPLETED";
  const tone: Tone =
    session.result === "PASSED" ? "solid" : session.result === "FAILED" ? "alert" : "soft";

  return {
    key: `interview-${session.id}`,
    href: `/job-seeker/interviews/${session.id}`,
    icon: Sparkles,
    iconTone: tone,
    title: `AI interview — ${session.jobTitle}`,
    meta: `${session.answeredCount}/${session.questionCount} answered${
      done ? ` • scored ${session.totalScore}` : ""
    }`,
    chip: humanize(done ? session.result : session.status),
    chipTone: tone,
    done,
  };
}

/* ---------------------------------------------------------------- files --- */

function FilesColumn({
  resumes,
  portfolios,
}: {
  resumes: ResumeResponse[];
  portfolios: PortfolioResponse[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-medium text-ws-fg">Files</h2>
        <Link
          href="/job-seeker/resumes/new"
          className="flex size-8 items-center justify-center rounded-full bg-ws-card text-ws-muted transition-colors hover:bg-ws-card-hover hover:text-ws-fg"
          aria-label="New resume"
        >
          <Plus aria-hidden="true" className="size-4" />
        </Link>
      </div>

      {resumes.map((resume) => (
        <FileCard
          key={`resume-${resume.id}`}
          href={`/job-seeker/resumes/${resume.id}`}
          eyebrow={formatDate(resume.updatedAt)}
          title={resume.title}
          badge={resume.isDefault ? "Default" : undefined}
          icon={<FileText aria-hidden="true" className="size-5" />}
        />
      ))}

      {portfolios.map((portfolio) => (
        <FileCard
          key={`portfolio-${portfolio.id}`}
          href={`/job-seeker/portfolios/${portfolio.id}`}
          eyebrow={`${portfolio.projects?.length ?? 0} projects`}
          title={portfolio.title}
          badge={portfolio.visibility === "PUBLIC" ? "Public" : undefined}
          icon={<FolderKanban aria-hidden="true" className="size-5" />}
        />
      ))}

      {!resumes.length && !portfolios.length ? (
        <Panel className="text-sm text-ws-faint">
          No resumes or portfolios yet.{" "}
          <Link href="/job-seeker/resumes/new" className="font-semibold text-ws-fg underline">
            Create your first
          </Link>
        </Panel>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------- helpers --- */

type Stage = "review" | "interview" | "hired" | "closed";

function stageOf(status: JobApplicationStatus): Stage {
  switch (status) {
    case "HIRED":
      return "hired";
    case "REJECTED":
    case "WITHDRAWN":
    case "AI_INTERVIEW_FAILED":
      return "closed";
    case "AI_INTERVIEW_REQUIRED":
    case "AI_INTERVIEW_IN_PROGRESS":
    case "AI_INTERVIEW_PASSED":
    case "SHORTLISTED":
    case "HUMAN_INTERVIEW_SCHEDULED":
      return "interview";
    default:
      return "review";
  }
}

function groupByStage(applications: JobApplicationResponse[]) {
  const empty: Record<Stage, JobApplicationResponse[]> = {
    review: [],
    interview: [],
    hired: [],
    closed: [],
  };

  return applications.reduce((groups, application) => {
    groups[stageOf(application.status)].push(application);
    return groups;
  }, empty);
}

function humanize(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .join(" ")
    .replace(/^./, (character) => character.toUpperCase());
}

function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function date(value: string) {
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
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
