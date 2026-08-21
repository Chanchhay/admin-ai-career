"use client";

import Link from "next/link";
import { Building2, Layers, Tags, UsersRound, Wrench } from "lucide-react";
import { StatTile } from "@/components/console/StatTile";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { Panel, PanelHeader } from "@/components/workspace/primitives";
import { useGetApplicationsQuery, useGetCompaniesQuery } from "@/services/moderationApi";
import {
  useGetIndustriesQuery,
  useGetJobCategoriesQuery,
  useGetSkillsQuery,
} from "@/services/taxonomyApi";

/**
 * The queue at a glance. Every number here is a `totalElements` off a real
 * query — the page asks for one row and reads the count, so nothing is
 * estimated and nothing is fetched twice over.
 */
export default function OverviewPage() {
  useSetPageHeading("Overview");

  const countOnly = { page: 0, size: 1 } as const;

  const pendingCompanies = useGetCompaniesQuery({
    verificationStatus: "PENDING_VERIFICATION",
    ...countOnly,
  });
  const approvedCompanies = useGetCompaniesQuery({
    verificationStatus: "APPROVED",
    ...countOnly,
  });
  const pendingApplications = useGetApplicationsQuery({
    status: "PENDING",
    ...countOnly,
  });
  const scheduledInterviews = useGetApplicationsQuery({
    status: "HUMAN_INTERVIEW_SCHEDULED",
    ...countOnly,
  });

  const industries = useGetIndustriesQuery();
  const jobCategories = useGetJobCategoriesQuery();
  const skills = useGetSkillsQuery();

  return (
    <div className="flex flex-col gap-5">
      <Panel tone="soft">
        <p className="text-sm leading-6">
          Companies wait on verification before their recruiters can post jobs;
          candidates wait on review before a recruiter ever sees them. Both
          queues are worked oldest-first.
        </p>
      </Panel>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Companies pending"
          value={pendingCompanies.data?.totalElements}
          hint="Awaiting a verification decision"
          icon={<Building2 aria-hidden="true" className="size-4" />}
        />
        <StatTile
          label="Companies approved"
          value={approvedCompanies.data?.totalElements}
          hint="Cleared to post jobs"
          icon={<Building2 aria-hidden="true" className="size-4" />}
        />
        <StatTile
          label="Applications pending"
          value={pendingApplications.data?.totalElements}
          hint="No decision recorded yet"
          icon={<UsersRound aria-hidden="true" className="size-4" />}
        />
        <StatTile
          label="Interviews scheduled"
          value={scheduledInterviews.data?.totalElements}
          hint="Human interview booked"
          icon={<UsersRound aria-hidden="true" className="size-4" />}
        />
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHeader
            title="Review queues"
            icon={<UsersRound aria-hidden="true" className="size-5" />}
          />
          <div className="flex flex-col gap-2">
            <QueueLink
              href="/companies"
              label="Company verification"
              count={pendingCompanies.data?.totalElements}
              caption="Approve, reject, or send back for revision."
            />
            <QueueLink
              href="/applications"
              label="Moderator results"
              count={pendingApplications.data?.totalElements}
              caption="View candidate results, interview, and record decisions."
            />
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Reference data"
            icon={<Layers aria-hidden="true" className="size-5" />}
          />
          <div className="flex flex-col gap-2">
            <QueueLink
              href="/industries"
              label="Industries"
              count={industries.data?.length}
              caption="Used to classify every company."
              icon={<Layers aria-hidden="true" className="size-4" />}
            />
            <QueueLink
              href="/job-categories"
              label="Job categories"
              count={jobCategories.data?.length}
              caption="Used to file every job post."
              icon={<Tags aria-hidden="true" className="size-4" />}
            />
            <QueueLink
              href="/skills"
              label="Skills"
              count={skills.data?.length}
              caption="Shared by jobs and candidate resumes."
              icon={<Wrench aria-hidden="true" className="size-4" />}
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function QueueLink({
  href,
  label,
  count,
  caption,
  icon,
}: {
  href: string;
  label: string;
  count: number | undefined;
  caption: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-[18px] bg-ws-card-hover px-4 py-3.5 transition-colors hover:bg-ws-panel"
    >
      {icon ? <span className="text-ws-muted">{icon}</span> : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ws-fg">
          {label}
        </span>
        <span className="block truncate text-xs text-ws-faint">{caption}</span>
      </span>
      <span className="shrink-0 text-lg font-bold tabular-nums text-ws-fg">
        {count ?? "—"}
      </span>
    </Link>
  );
}
