"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Briefcase,
  Building2,
  FileText,
  Flag,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  Chip,
  FileCard,
  GhostChip,
  IconAction,
  NoteBar,
  Panel,
  PanelHeader,
  PillTabs,
  PipelineTrack,
  TimelineRow,
  type Tone,
} from "@/components/workspace/primitives";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import type { CurrentUserResponse } from "@/contracts/api/auth";
import type {
  CompanyDocumentResponse,
  CompanyResponse,
  ForwardedApplicationResponse,
  JobPostResponse,
} from "@/contracts/api/recruiter";

type RecruiterWorkspaceProps = {
  user?: CurrentUserResponse;
  company: CompanyResponse;
  jobs: JobPostResponse[];
  candidates: ForwardedApplicationResponse[];
  documents: CompanyDocumentResponse[];
};

export function RecruiterWorkspace({
  user,
  company,
  jobs,
  candidates,
  documents,
}: RecruiterWorkspaceProps) {
  useSetPageHeading(company.name);

  const byStatus = (...statuses: JobPostResponse["status"][]) =>
    jobs.filter((job) => statuses.includes(job.status));

  const published = byStatus("PUBLISHED");
  const paused = byStatus("PAUSED");
  const drafts = byStatus("DRAFT", "PENDING");
  const retired = byStatus("CLOSED", "EXPIRED", "REJECTED");

  return (
    <div className="flex flex-col gap-5">
      <Hero company={company} candidates={candidates} published={published.length} />

      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-ws-muted">Job pipeline</span>
        <GhostChip>
          <Flag aria-hidden="true" className="size-3.5" />
          {today()}
        </GhostChip>
      </div>

      <PipelineTrack
        segments={[
          { label: "Published", count: published.length, tone: "solid" },
          { label: "Paused", count: paused.length, tone: "soft" },
          { label: "Drafts", count: drafts.length, tone: "quiet" },
        ]}
        restLabel={`${retired.length} closed`}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_minmax(0,19rem)]">
        <div className="flex flex-col gap-5">
          <CompanyNote company={company} user={user} />
          <VerificationNote company={company} documents={documents} />
        </div>

        <ActivityStream jobs={jobs} candidates={candidates} documents={documents} />

        <FilesColumn company={company} documents={documents} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- hero --- */

function Hero({
  company,
  candidates,
  published,
}: {
  company: CompanyResponse;
  candidates: ForwardedApplicationResponse[];
  published: number;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-ws-muted">{company.name}</span>
          {company.industryName ? (
            <Chip tone="soft">{company.industryName}</Chip>
          ) : null}
        </div>

        {/* The page's single anchor, sized like the balance in the reference. */}
        <p className="mt-1 flex items-baseline gap-2 text-ws-fg">
          <span className="text-5xl font-semibold tracking-tight tabular-nums lg:text-6xl">
            {candidates.length}
          </span>
          <span className="text-xl font-medium text-ws-faint lg:text-2xl">
            candidates forwarded
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/recruiter/jobs/new"
          className="flex items-center gap-2 rounded-full bg-ws-card px-4 py-2.5 text-sm font-medium text-ws-muted transition-colors hover:bg-ws-card-hover hover:text-ws-fg"
        >
          <Plus aria-hidden="true" className="size-4" />
          Post a job
        </Link>
        <Chip tone="solid" className="px-4 py-2 text-sm">
          {published} live
        </Chip>
        <Chip tone="quiet" className="px-4 py-2 text-sm">
          {candidates.length} in review
        </Chip>
        <IconAction label="More actions" className="bg-ws-card">
          <MoreHorizontal aria-hidden="true" className="size-4" />
        </IconAction>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- notes --- */

function CompanyNote({
  company,
  user,
}: {
  company: CompanyResponse;
  user?: CurrentUserResponse;
}) {
  const rows = [
    { icon: Building2, label: "Company", value: company.name },
    { icon: UserRound, label: "Recruiter", value: user?.fullName ?? "—" },
    { icon: Mail, label: "Email", value: company.contactEmail || "Not set" },
    { icon: Phone, label: "Phone", value: company.contactPhone || "Not set" },
    { icon: MapPin, label: "Address", value: company.address || "Not set" },
  ];

  /* The reference closes this card with a row of round shortcuts. */
  const shortcuts = [
    { icon: Briefcase, label: "Jobs", href: "/recruiter/jobs" },
    { icon: UsersRound, label: "Talent", href: "/recruiter/talent" },
    { icon: FileText, label: "Documents", href: "/recruiter/company/documents" },
    { icon: Globe, label: "Company", href: "/recruiter/company" },
  ];

  return (
    <Panel tone="soft">
      <PanelHeader
        title="Details"
        icon={<Building2 aria-hidden="true" className="size-4" />}
        action={
          <IconAction label="Edit company" href="/recruiter/company">
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

      <div className="mt-5 flex items-center gap-2">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.label}
            href={shortcut.href}
            aria-label={shortcut.label}
            className="flex size-9 items-center justify-center rounded-full bg-ws-fg/10 transition-colors hover:bg-ws-fg/20"
          >
            <shortcut.icon aria-hidden="true" className="size-4" />
          </Link>
        ))}
      </div>
    </Panel>
  );
}

function VerificationNote({
  company,
  documents,
}: {
  company: CompanyResponse;
  documents: CompanyDocumentResponse[];
}) {
  const pending = documents.filter((document) => document.status === "PENDING");
  const approved = company.verificationStatus === "APPROVED";

  return (
    <Panel>
      <PanelHeader
        title="Verification"
        icon={<ShieldCheck aria-hidden="true" className="size-4" />}
        action={
          <IconAction label="Manage documents" href="/recruiter/company/documents">
            <Pencil aria-hidden="true" className="size-4" />
          </IconAction>
        }
      />

      <p className="text-[11px] font-medium uppercase tracking-wide text-ws-faint">
        Company status
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">
        {humanize(company.verificationStatus)}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <Chip tone={approved ? "solid" : "quiet"}>
          {approved ? "Verified" : "Awaiting review"}
        </Chip>
        <Chip tone={pending.length ? "soft" : "quiet"}>
          {pending.length ? `${pending.length} pending docs` : "Docs clear"}
        </Chip>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------ activity stream --- */

const streamTabs = ["Candidates", "Jobs", "Documents"] as const;
type StreamTab = (typeof streamTabs)[number];

type Row = {
  key: string;
  href: string;
  date: string;
  icon: React.ReactNode;
  iconTone: Tone;
  title: string;
  meta: string;
  chip: string;
  chipTone: Tone;
  done: boolean;
};

function ActivityStream({
  jobs,
  candidates,
  documents,
}: {
  jobs: JobPostResponse[];
  candidates: ForwardedApplicationResponse[];
  documents: CompanyDocumentResponse[];
}) {
  const [tab, setTab] = useState<StreamTab>("Candidates");

  const rows =
    tab === "Jobs"
      ? jobs.map(jobRow)
      : tab === "Documents"
        ? documents.map(documentRow)
        : candidates.map(candidateRow);

  const sections = [
    { heading: "In progress", rows: rows.filter((row) => !row.done) },
    { heading: "Done", rows: rows.filter((row) => row.done) },
  ];

  return (
    <Panel className="relative flex min-h-104 flex-col p-0">
      <div className="flex items-center gap-3 p-3">
        <PillTabs tabs={streamTabs} value={tab} onChange={setTab} />
        <span className="ml-auto hidden shrink-0 pr-2 text-xs text-ws-faint sm:block">
          {rows.length} total
        </span>
      </div>

      <div className="ws-scroll flex-1 overflow-y-auto px-3 pb-28">
        {sections.map((section) =>
          section.rows.length ? (
            <div key={section.heading} className="mb-2">
              <h3 className="px-2 py-3 text-lg font-medium text-ws-fg">
                {section.heading}
              </h3>
              <ul className="flex flex-col">
                {section.rows.map((row, index) => (
                  <TimelineRow
                    key={row.key}
                    href={row.href}
                    date={row.date}
                    icon={row.icon}
                    iconTone={row.iconTone}
                    title={row.title}
                    meta={row.meta}
                    chip={row.chip}
                    chipTone={row.chipTone}
                    done={row.done}
                    last={index === section.rows.length - 1}
                  />
                ))}
              </ul>
            </div>
          ) : null,
        )}

        {rows.length ? null : (
          <p className="px-2 py-10 text-center text-sm text-ws-faint">
            Nothing in this stream yet.
          </p>
        )}
      </div>

      {/* Composer plus the single call to action, as in the reference. */}
      <div className="absolute inset-x-3 bottom-3">
        <NoteBar placeholder="Take a note" />
      </div>
      <Link
        href="/recruiter/jobs/new"
        className="absolute bottom-14 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-ws-fg px-5 py-3 text-sm font-semibold text-ws-panel shadow-(--shadow-dropdown) transition-transform hover:scale-105"
      >
        <Plus aria-hidden="true" className="size-4" />
        Add new
      </Link>
    </Panel>
  );
}

function candidateRow(item: ForwardedApplicationResponse): Row {
  const status = item.application.status;
  const done = status === "HIRED" || status === "REJECTED";

  return {
    key: `candidate-${item.application.id}`,
    href: `/recruiter/forwarded-candidates/${item.application.id}`,
    date: shortDate(item.forwardedAt),
    icon: <UsersRound aria-hidden="true" className="size-4" />,
    iconTone: done ? "quiet" : "solid",
    title: item.candidate.headline || item.candidate.currentPosition || "Candidate",
    meta: `${item.application.jobTitle} • ${item.submittedResume?.title || "No resume"}`,
    chip: humanize(status),
    chipTone: status === "REJECTED" ? "alert" : done ? "quiet" : "soft",
    done,
  };
}

function jobRow(job: JobPostResponse): Row {
  const done = ["CLOSED", "EXPIRED", "REJECTED"].includes(job.status);

  return {
    key: `job-${job.id}`,
    href: `/recruiter/jobs/${job.id}`,
    date: shortDate(job.publishedAt),
    icon: <Briefcase aria-hidden="true" className="size-4" />,
    iconTone: job.status === "PUBLISHED" ? "solid" : "soft",
    title: job.title,
    meta: [job.location, humanize(job.workMode), humanize(job.jobType)]
      .filter(Boolean)
      .join(" • "),
    chip: humanize(job.status),
    chipTone: job.status === "PUBLISHED" ? "solid" : done ? "quiet" : "soft",
    done,
  };
}

function documentRow(document: CompanyDocumentResponse): Row {
  const done = document.status === "ACTIVE";

  return {
    key: `document-${document.id}`,
    href: "/recruiter/company/documents",
    date: shortDate(document.createdAt),
    icon: <MessageSquare aria-hidden="true" className="size-4" />,
    iconTone: done ? "quiet" : "soft",
    title: humanize(document.documentType),
    meta: document.documentUrl || "No file attached",
    chip: humanize(document.status),
    chipTone: done ? "solid" : "soft",
    done,
  };
}

/* ---------------------------------------------------------------- files --- */

function FilesColumn({
  company,
  documents,
}: {
  company: CompanyResponse;
  documents: CompanyDocumentResponse[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-medium text-ws-fg">Files</h2>
        <Link
          href="/recruiter/company/documents"
          aria-label="Upload a document"
          className="flex size-8 items-center justify-center rounded-full bg-ws-card text-ws-muted transition-colors hover:bg-ws-card-hover hover:text-ws-fg"
        >
          <Plus aria-hidden="true" className="size-4" />
        </Link>
      </div>

      {documents.map((document) => (
        <FileCard
          key={document.id}
          href="/recruiter/company/documents"
          eyebrow={shortDate(document.createdAt)}
          title={humanize(document.documentType)}
          badge={document.status === "ACTIVE" ? "Verified" : undefined}
          icon={<FileText aria-hidden="true" className="size-5" />}
        />
      ))}

      {documents.length ? null : (
        <Panel className="text-sm text-ws-faint">
          No documents uploaded for {company.name} yet.{" "}
          <Link
            href="/recruiter/company/documents"
            className="font-semibold text-ws-fg underline"
          >
            Upload one
          </Link>
        </Panel>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- helpers --- */

function humanize(value: string) {
  if (!value) return "—";

  return value
    .toLowerCase()
    .split("_")
    .join(" ")
    .replace(/^./, (character) => character.toUpperCase());
}

function shortDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function today() {
  return new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
