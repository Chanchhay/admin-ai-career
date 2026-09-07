"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Building2,
  CircleCheck,
  CircleX,
  Layers,
  MoreHorizontal,
  Plus,
  Tags,
  UsersRound,
  Wrench,
} from "lucide-react";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import {
  Chip,
  FolderTabs,
  GhostChip,
  IconAction,
  NotchedPanel,
  Panel,
  PipelineTrack,
  toneFill,
  type Tone,
} from "@/components/workspace/primitives";
import {
  useGetApplicationsQuery,
  useGetCompaniesQuery,
} from "@/services/moderationApi";
import {
  useGetIndustriesQuery,
  useGetJobCategoriesQuery,
  useGetSkillsQuery,
} from "@/services/taxonomyApi";
import type {
  CandidateApplicationListItem,
  ModeratorCompanyListItem,
} from "@/contracts/api/moderation";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";

const queueTabs = ["Companies", "Candidates"] as const;
type QueueTab = (typeof queueTabs)[number];

/**
 * The queue at a glance. Every number here is a `totalElements` off a real
 * query — nothing is estimated and nothing is fetched twice over. The pages
 * ask for the first few rows rather than a bare count, so the same request
 * that gives the number also fills the stream beneath it.
 */
export default function OverviewPage() {
  const tx = useWorkspaceTranslation();
  useSetPageHeading(tx("Overview"));

  const firstPage = { page: 0, size: 5 } as const;

  const pendingCompanies = useGetCompaniesQuery({
    verificationStatus: "PENDING_VERIFICATION",
    ...firstPage,
  });
  const approvedCompanies = useGetCompaniesQuery({
    verificationStatus: "APPROVED",
    ...firstPage,
  });
  const pendingApplications = useGetApplicationsQuery({
    status: "PENDING",
    ...firstPage,
  });
  const scheduledInterviews = useGetApplicationsQuery({
    status: "HUMAN_INTERVIEW_SCHEDULED",
    ...firstPage,
  });
  const passedApplications = useGetApplicationsQuery({
    status: "APPROVED",
    ...firstPage,
  });
  const failedApplications = useGetApplicationsQuery({
    status: "REJECTED",
    ...firstPage,
  });

  const industries = useGetIndustriesQuery();
  const jobCategories = useGetJobCategoriesQuery();
  const skills = useGetSkillsQuery();

  const companiesWaiting = pendingCompanies.data?.totalElements;
  const candidatesWaiting = pendingApplications.data?.totalElements;
  const waiting = (companiesWaiting ?? 0) + (candidatesWaiting ?? 0);
  const loaded =
    companiesWaiting !== undefined && candidatesWaiting !== undefined;

  return (
    <div className="flex flex-col gap-5">
      <Hero
        waiting={loaded ? waiting : undefined}
        companies={companiesWaiting}
      />

      <PipelineTrack
        segments={[
          {
            label: "Awaiting review",
            count: candidatesWaiting ?? 0,
            tone: "soft",
          },
          {
            label: "Interviewing",
            count: scheduledInterviews.data?.totalElements ?? 0,
            tone: "solid",
          },
          {
            label: "Approved",
            count: passedApplications.data?.totalElements ?? 0,
            tone: "quiet",
          },
        ]}
        restLabel={tx("{count} rejected", {
          count: failedApplications.data?.totalElements ?? 0,
        })}
      />

      {/*
       * Three columns that stack, not a grid of equal metric tiles: the
       * standing counts on the left, the live queue in the middle, the
       * decisions already recorded on the right.
       */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_minmax(0,19rem)]">
        <div className="flex flex-col gap-5 md:max-xl:grid md:max-xl:grid-cols-2">
          <QueueNote
            companies={companiesWaiting}
            candidates={candidatesWaiting}
            interviews={scheduledInterviews.data?.totalElements}
          />
          <ReferenceNote
            industries={industries.data?.length}
            jobCategories={jobCategories.data?.length}
            skills={skills.data?.length}
          />
        </div>

        <QueueStream
          companies={pendingCompanies.data?.content}
          candidates={pendingApplications.data?.content}
          companiesLoading={pendingCompanies.isLoading}
          candidatesLoading={pendingApplications.isLoading}
        />

        <DecisionColumn
          approvedCompanies={approvedCompanies.data?.totalElements}
          passed={passedApplications.data?.totalElements}
          failed={failedApplications.data?.totalElements}
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- hero --- */

/**
 * The page's single anchor: one compact count for everything
 * still waiting on a moderator. The two queue links sit opposite it as the
 * only filled controls on the page.
 */
function Hero({
  waiting,
  companies,
}: {
  waiting: number | undefined;
  companies: number | undefined;
}) {
  const tx = useWorkspaceTranslation();

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-ws-muted">
            {tx("Moderation queue")}
          </span>
          {waiting === 0 ? (
            <Chip tone="solid">{tx("All clear")}</Chip>
          ) : (
            <Chip tone="soft">{tx("Oldest first")}</Chip>
          )}
          <GhostChip>
            {tx("{count} awaiting verification", {
              count: companies === undefined ? "—" : companies,
            })}
          </GhostChip>
        </div>

        <p className="mt-1 flex items-baseline gap-2 max-sm:flex-wrap text-ws-fg">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {waiting === undefined ? "—" : waiting.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-ws-muted">
            {waiting === 1 ? tx("item waits") : tx("items wait")}{" "}
            {tx("on a decision")}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2 max-sm:flex-wrap">
        <Link href="/companies" className={cnPill("solid")}>
          {tx("Companies")}
        </Link>
        <Link href="/applications" className={cnPill("soft")}>
          {tx("Candidates")}
        </Link>
        <IconAction label="More" href="/users" className="bg-ws-card">
          <MoreHorizontal aria-hidden="true" className="size-4" />
        </IconAction>
      </div>
    </div>
  );
}

/** Hero pills reuse the tone fills so they match the track below them. */
function cnPill(tone: Tone) {
  return `rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.03] ${toneFill[tone]}`;
}

/* --------------------------------------------------------------- notes --- */

/** The yellow note: what is still on the desk, and why it is worked in order. */
function QueueNote({
  companies,
  candidates,
  interviews,
}: {
  companies: number | undefined;
  candidates: number | undefined;
  interviews: number | undefined;
}) {
  const tx = useWorkspaceTranslation();

  return (
    <NotchedPanel
      fill="warm"
      title="Queues"
      icon={<UsersRound aria-hidden="true" className="size-4 shrink-0" />}
      actions={
        <>
          <IconAction
            label="Open companies"
            href="/companies"
            className="bg-ws-card text-ws-muted opacity-100 hover:bg-ws-card-hover hover:text-ws-fg"
          >
            <Building2 aria-hidden="true" className="size-4" />
          </IconAction>
          <IconAction
            label="Open candidates"
            href="/applications"
            className="bg-ws-card text-ws-muted opacity-100 hover:bg-ws-card-hover hover:text-ws-fg"
          >
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </IconAction>
        </>
      }
    >
      <dl className="flex flex-col gap-3">
        <NoteRow label="Companies pending" value={companies} />
        <NoteRow label="Candidates pending" value={candidates} />
        <NoteRow label="Interviews booked" value={interviews} />
      </dl>

      <p className="mt-6 text-xs leading-7 opacity-75">
        {tx(
          "Companies wait on verification before their recruiters can post jobs; candidates wait on review before a recruiter ever sees them. Both queues are worked oldest-first.",
        )}
      </p>
    </NotchedPanel>
  );
}

/** The lilac note: the taxonomy every other screen files its rows against. */
function ReferenceNote({
  industries,
  jobCategories,
  skills,
}: {
  industries: number | undefined;
  jobCategories: number | undefined;
  skills: number | undefined;
}) {
  return (
    <NotchedPanel
      fill="cool"
      title="Reference data"
      icon={<Layers aria-hidden="true" className="size-4 shrink-0" />}
      actions={
        <IconAction
          label="Manage industries"
          href="/industries"
          className="bg-ws-card text-ws-muted opacity-100 hover:bg-ws-card-hover hover:text-ws-fg"
        >
          <Plus aria-hidden="true" className="size-4" />
        </IconAction>
      }
    >
      <dl className="flex flex-col gap-3">
        <NoteRow
          label="Industries"
          value={industries}
          href="/industries"
          icon={<Layers aria-hidden="true" className="size-3.5" />}
        />
        <NoteRow
          label="Job categories"
          value={jobCategories}
          href="/job-categories"
          icon={<Tags aria-hidden="true" className="size-3.5" />}
        />
        <NoteRow
          label="Skills"
          value={skills}
          href="/skills"
          icon={<Wrench aria-hidden="true" className="size-3.5" />}
        />
      </dl>
    </NotchedPanel>
  );
}

/** One line of a note card: label left, count right, the whole row a link. */
function NoteRow({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: number | undefined;
  href?: string;
  icon?: React.ReactNode;
}) {
  const tx = useWorkspaceTranslation();
  const body = (
    <>
      {icon ? <span className="shrink-0 opacity-60">{icon}</span> : null}
      <dt className="min-w-0 flex-1 truncate text-sm font-medium opacity-80">
        {tx(label)}
      </dt>
      <dd className="shrink-0 text-lg font-bold tabular-nums">
        {value === undefined ? "—" : value.toLocaleString()}
      </dd>
    </>
  );

  return href ? (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-full px-1 transition-opacity hover:opacity-70"
    >
      {body}
    </Link>
  ) : (
    <div className="flex items-center gap-2 px-1">{body}</div>
  );
}

/* -------------------------------------------------------------- stream --- */

/**
 * The live queue, tabbed between the two things a moderator decides. The tabs
 * are cut from the panel below them, so switching reads as turning a folder
 * rather than swapping a card.
 */
function QueueStream({
  companies,
  candidates,
  companiesLoading,
  candidatesLoading,
}: {
  companies: ModeratorCompanyListItem[] | undefined;
  candidates: CandidateApplicationListItem[] | undefined;
  companiesLoading: boolean;
  candidatesLoading: boolean;
}) {
  const tx = useWorkspaceTranslation();
  const [tab, setTab] = useState<QueueTab>("Companies");
  const showing = tab === "Companies" ? companies : candidates;
  const loading = tab === "Companies" ? companiesLoading : candidatesLoading;

  return (
    <div className="flex min-w-0 flex-col">
      <FolderTabs
        tabs={queueTabs}
        value={tab}
        onChange={setTab}
        aside={tx("Oldest first")}
      />

      {/*
       * A flat sheet, not a notched one: the active tab's fillets need a
       * straight top edge of the same fill to stand on, which the notch's
       * short rounded strip does not give them. Only the top-left corner
       * keeps its radius, so the sheet still reads as cut from the tab.
       */}
      <Panel className="flex flex-1 flex-col rounded-tl-[28px] pt-4">
        <header className="mb-3 flex items-center gap-2 px-1">
          {tab === "Companies" ? (
            <Building2
              aria-hidden="true"
              className="size-4 shrink-0 text-ws-muted"
            />
          ) : (
            <UsersRound
              aria-hidden="true"
              className="size-4 shrink-0 text-ws-muted"
            />
          )}
          <h2 className="truncate text-lg font-semibold tracking-tight">
            {tab === "Companies"
              ? tx("Awaiting verification")
              : tx("Awaiting review")}
          </h2>
          <IconAction
            label={
              tab === "Companies"
                ? tx("Open all companies")
                : tx("Open all candidates")
            }
            href={tab === "Companies" ? "/companies" : "/applications"}
            className="ml-auto"
          >
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </IconAction>
        </header>

        {loading ? (
          <p className="py-10 text-center text-sm text-ws-faint">
            {tx("Loading…")}
          </p>
        ) : !showing?.length ? (
          <p className="py-10 text-center text-sm text-ws-faint">
            {tx("Nothing waiting. This queue is clear.")}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {tab === "Companies"
              ? (showing as ModeratorCompanyListItem[]).map((company) => (
                  <StreamRow
                    key={company.id}
                    href={`/companies/${company.id}`}
                    title={company.name}
                    meta={company.industryName || company.contactEmail}
                    chip={humanize(company.verificationStatus)}
                    chipTone="soft"
                  />
                ))
              : (showing as CandidateApplicationListItem[]).map((item) => (
                  <StreamRow
                    key={item.application.id}
                    href={`/applications/${item.application.id}`}
                    title={item.application.jobTitle}
                    meta={
                      item.candidate.headline ||
                      item.candidate.currentPosition ||
                      tx("Candidate")
                    }
                    chip={humanize(item.review.reviewStatus)}
                    chipTone="soft"
                  />
                ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function StreamRow({
  href,
  title,
  meta,
  chip,
  chipTone,
}: {
  href: string;
  title: string;
  meta: string;
  chip: string;
  chipTone: Tone;
}) {
  const tx = useWorkspaceTranslation();

  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 rounded-[22px] bg-ws-card-hover px-4 py-3.5 transition-colors hover:bg-ws-panel"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-ws-fg">
            {title}
          </span>
          <span className="block truncate text-xs text-ws-faint">
            {tx(meta)}
          </span>
        </span>
        <Chip tone={chipTone} className="shrink-0">
          {tx(chip)}
        </Chip>
      </Link>
    </li>
  );
}

/* ----------------------------------------------------------- decisions --- */

/** What the console has already settled, kept off the working queue. */
function DecisionColumn({
  approvedCompanies,
  passed,
  failed,
}: {
  approvedCompanies: number | undefined;
  passed: number | undefined;
  failed: number | undefined;
}) {
  return (
    <NotchedPanel
      title="Decided"
      icon={<CircleCheck aria-hidden="true" className="size-4 shrink-0" />}
      actions={
        <IconAction
          label="Open applications"
          href="/applications"
          className="bg-ws-card text-ws-muted opacity-100 hover:bg-ws-card-hover hover:text-ws-fg"
        >
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </IconAction>
      }
    >
      <div className="flex flex-col gap-3">
        <DecisionCard
          tone="solid"
          label="Candidates passed"
          value={passed}
          caption="Approved for their job"
          icon={<CircleCheck aria-hidden="true" className="size-4" />}
          href="/applications"
        />
        <DecisionCard
          tone="alert"
          label="Candidates failed"
          value={failed}
          caption="Rejected for their job"
          icon={<CircleX aria-hidden="true" className="size-4" />}
          href="/applications"
        />
        <DecisionCard
          tone="quiet"
          label="Companies approved"
          value={approvedCompanies}
          caption="Cleared to post jobs"
          icon={<Building2 aria-hidden="true" className="size-4" />}
          href="/companies"
        />
      </div>
    </NotchedPanel>
  );
}

function DecisionCard({
  tone,
  label,
  value,
  caption,
  icon,
  href,
}: {
  tone: Tone;
  label: string;
  value: number | undefined;
  caption: string;
  icon: React.ReactNode;
  href: string;
}) {
  const tx = useWorkspaceTranslation();

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-[26px] bg-ws-card-hover px-4 py-4 transition-colors hover:bg-ws-panel"
    >
      {/* The tone rides on the disc, not on the card: the brand reads as an
          accent beside a number rather than as another block of colour. */}
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${toneFill[tone]}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ws-fg">
          {tx(label)}
        </span>
        <span className="block truncate text-xs text-ws-faint">
          {tx(caption)}
        </span>
      </span>
      <span className="shrink-0 text-2xl font-bold tabular-nums text-ws-fg">
        {value === undefined ? "—" : value.toLocaleString()}
      </span>
    </Link>
  );
}

/* -------------------------------------------------------------- helpers --- */

/** `PENDING_VERIFICATION` → `Pending verification`. */
function humanize(value: string) {
  const words = value.toLowerCase().replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
