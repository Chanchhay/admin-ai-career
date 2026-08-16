"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  FileText,
  Flag,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  ShieldCheck,
  Sparkles,
  UsersRound,
  XCircle,
  type LucideIcon,
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
import type { CompanyVerificationStatus } from "@/contracts/api/common";
import type { CompanyResponse } from "@/contracts/api/recruiter";

const STATUS_FILTERS = [
  { label: "Pending", value: "PENDING_VERIFICATION" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Suspended", value: "SUSPENDED" },
] as const;

const statusMap: Record<CompanyVerificationStatus, string> = {
  PENDING_VERIFICATION: "Pending verification",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SUSPENDED: "Suspended",
};

const chipTone: Record<CompanyVerificationStatus, "solid" | "soft" | "quiet" | "alert"> = {
  PENDING_VERIFICATION: "soft",
  APPROVED: "solid",
  REJECTED: "alert",
  SUSPENDED: "quiet",
};

const streamTabs = ["Queue", "Approved", "Rejected"] as const;
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

type AdminWorkspaceProps = {
  companies: CompanyResponse[];
  totalCount: number;
  status: CompanyVerificationStatus;
  isLoading: boolean;
  isError: boolean;
  onStatusChange: (status: CompanyVerificationStatus) => void;
  onRefresh: () => void;
  onApprove: (companyId: number) => void;
  onReject: (companyId: number) => void;
  isApproving: boolean;
  isRejecting: boolean;
};

export function AdminWorkspace({
  companies,
  totalCount,
  status,
  isLoading,
  isError,
  onStatusChange,
  onRefresh,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: AdminWorkspaceProps) {
  useSetPageHeading("Moderation desk");

  const queueCount = companies.filter((company) => company.verificationStatus === "PENDING_VERIFICATION").length;
  const approvedCount = companies.filter((company) => company.verificationStatus === "APPROVED").length;
  const rejectedCount = companies.filter((company) => company.verificationStatus === "REJECTED").length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-ws-muted">Moderator workspace</span>
            <Chip tone="solid">Trust ops</Chip>
          </div>

          <p className="mt-1 flex items-baseline gap-2 text-ws-fg">
            <span className="text-5xl font-semibold tracking-tight tabular-nums lg:text-6xl">
              {totalCount}
            </span>
            <span className="text-xl font-medium text-ws-faint lg:text-2xl">
              companies in review
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center gap-2 rounded-full bg-ws-card px-4 py-2.5 text-sm font-medium text-ws-muted transition-colors hover:bg-ws-card-hover hover:text-ws-fg"
          >
            <Sparkles aria-hidden="true" className="size-4" />
            Refresh
          </button>
          <Chip tone="soft" className="px-4 py-2 text-sm">
            {queueCount} pending
          </Chip>
          <Chip tone="alert" className="px-4 py-2 text-sm">
            {rejectedCount} rejected
          </Chip>
          <IconAction label="More actions" className="bg-ws-card">
            <MoreHorizontal aria-hidden="true" className="size-4" />
          </IconAction>
        </div>
      </div>

      <PipelineTrack
        segments={[
          { label: "Pending", count: queueCount, tone: "soft" },
          { label: "Approved", count: approvedCount, tone: "solid" },
          { label: "Rejected", count: rejectedCount, tone: "alert" },
        ]}
        restLabel={`${Math.max(totalCount - queueCount - approvedCount - rejectedCount, 0)} suspended`}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_minmax(0,19rem)]">
        <div className="flex flex-col gap-5">
          <Panel tone="soft">
            <PanelHeader
              title="Overview"
              icon={<ShieldCheck aria-hidden="true" className="size-4" />}
              action={
                <IconAction label="Review queue" onClick={onRefresh}>
                  <Pencil aria-hidden="true" className="size-4" />
                </IconAction>
              }
            />

            <dl className="flex flex-col gap-3">
              {[
                { icon: Building2, label: "Pending", value: `${queueCount}` },
                { icon: CheckCircle2, label: "Approved", value: `${approvedCount}` },
                { icon: XCircle, label: "Rejected", value: `${rejectedCount}` },
                { icon: Globe, label: "Status", value: statusMap[status] },
              ].map((row) => (
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
              <Link
                href="/admin/dashboard"
                className="flex size-9 items-center justify-center rounded-full bg-ws-fg/10 transition-colors hover:bg-ws-fg/20"
                aria-label="Dashboard"
              >
                <ShieldCheck aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="/admin/reviews"
                className="flex size-9 items-center justify-center rounded-full bg-ws-fg/10 transition-colors hover:bg-ws-fg/20"
                aria-label="Reviews"
              >
                <Building2 aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="/admin/history"
                className="flex size-9 items-center justify-center rounded-full bg-ws-fg/10 transition-colors hover:bg-ws-fg/20"
                aria-label="History"
              >
                <UsersRound aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              title="Filter"
              icon={<Flag aria-hidden="true" className="size-4" />}
            />
            <PillTabs
              tabs={STATUS_FILTERS.map((item) => item.value)}
              value={status}
              onChange={onStatusChange}
            />
            <div className="mt-4 text-sm text-ws-faint">
              Select a queue to review the trust and compliance signals for each company.
            </div>
          </Panel>
        </div>

        <Panel className="relative flex min-h-104 flex-col p-0">
          <div className="flex items-center gap-3 p-3">
            <PillTabs tabs={streamTabs} value={tabForStatus(status)} onChange={(tab) => onStatusChange(tabToStatus(tab))} />
            <span className="ml-auto hidden shrink-0 pr-2 text-xs text-ws-faint sm:block">
              {companies.length} total
            </span>
          </div>

          <div className="ws-scroll flex-1 overflow-y-auto px-3 pb-28">
            {isLoading ? (
              <p className="px-2 py-10 text-center text-sm text-ws-faint">Loading moderation queue...</p>
            ) : isError ? (
              <p className="px-2 py-10 text-center text-sm text-ws-faint">Unable to load moderation queue.</p>
            ) : companies.length === 0 ? (
              <p className="px-2 py-10 text-center text-sm text-ws-faint">No companies in this queue yet.</p>
            ) : (
              <>
                {renderSections(companies, onApprove, onReject, isApproving, isRejecting)}
              </>
            )}
          </div>

          <div className="absolute inset-x-3 bottom-3">
            <NoteBar placeholder="Add a review note" />
          </div>
          <Link
            href="/admin/reviews"
            className="absolute bottom-14 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-ws-fg px-5 py-3 text-sm font-semibold text-ws-panel shadow-(--shadow-dropdown) transition-transform hover:scale-105"
          >
            <Plus aria-hidden="true" className="size-4" />
            Review queue
          </Link>
        </Panel>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-medium text-ws-fg">Review files</h2>
            <Link
              href="/admin/history"
              aria-label="Open moderation history"
              className="flex size-8 items-center justify-center rounded-full bg-ws-card text-ws-muted transition-colors hover:bg-ws-card-hover hover:text-ws-fg"
            >
              <Plus aria-hidden="true" className="size-4" />
            </Link>
          </div>

          {companies.slice(0, 3).map((company) => (
            <FileCard
              key={company.id}
              href="/admin/dashboard"
              eyebrow={shortDate(new Date().toISOString())}
              title={company.name}
              badge={company.verificationStatus === "APPROVED" ? "Verified" : undefined}
              icon={<FileText aria-hidden="true" className="size-5" />}
            />
          ))}

          {companies.length === 0 ? (
            <Panel className="text-sm text-ws-faint">
              No verification files to review yet.
            </Panel>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function tabForStatus(status: CompanyVerificationStatus): StreamTab {
  if (status === "APPROVED") return "Approved";
  if (status === "REJECTED") return "Rejected";
  return "Queue";
}

function tabToStatus(tab: StreamTab): CompanyVerificationStatus {
  if (tab === "Approved") return "APPROVED";
  if (tab === "Rejected") return "REJECTED";
  return "PENDING_VERIFICATION";
}

function renderSections(
  companies: CompanyResponse[],
  onApprove: (companyId: number) => void,
  onReject: (companyId: number) => void,
  isApproving: boolean,
  isRejecting: boolean,
) {
  const rows: Row[] = companies.map((company) => {
    const done = company.verificationStatus === "APPROVED" || company.verificationStatus === "REJECTED";

    return {
      key: `company-${company.id}`,
      href: "/admin/dashboard",
      date: shortDate(company.address || new Date().toISOString()),
      icon: <Building2 aria-hidden="true" className="size-4" />,
      iconTone: done ? "quiet" : "soft",
      title: company.name,
      meta: `${company.industryName || "Industry not set"} • ${company.contactEmail || "No email"}`,
      chip: humanize(company.verificationStatus),
      chipTone: chipTone[company.verificationStatus] ?? "quiet",
      done,
    };
  });

  const sections = [
    { heading: "In progress", rows: rows.filter((row) => !row.done) },
    { heading: "Completed", rows: rows.filter((row) => row.done) },
  ];

  return sections.map((section) =>
    section.rows.length ? (
      <div key={section.heading} className="mb-2">
        <h3 className="px-2 py-3 text-lg font-medium text-ws-fg">{section.heading}</h3>
        <ul className="flex flex-col">
          {section.rows.map((row, index) => (
            <li key={row.key} className="flex items-stretch gap-3">
              <div className="relative flex w-11 shrink-0 flex-col items-center pt-2">
                <span className={"flex size-9 items-center justify-center rounded-full " + (row.done ? "bg-chip-quiet text-chip-quiet-fg" : "bg-chip-soft text-chip-soft-fg")}>
                  {row.done ? <CheckCircle2 aria-hidden="true" className="size-4" /> : row.icon}
                </span>
                <span className="mt-1.5 text-[10px] font-medium text-ws-faint">{row.date}</span>
                {index === section.rows.length - 1 ? null : (
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 top-13 mx-auto w-px bg-ws-line" />
                )}
              </div>

              <div className="mb-2 flex min-w-0 flex-1 flex-col gap-3 rounded-[18px] bg-ws-card-hover px-4 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="min-w-0 flex-1">
                    <span className={"block truncate text-sm font-semibold text-ws-fg" + (row.done ? " line-through opacity-60" : "")}>
                      {row.title}
                    </span>
                    <span className="block truncate text-xs text-ws-faint">{row.meta}</span>
                  </span>
                  <Chip tone={row.chipTone} className="shrink-0">
                    {row.chip}
                  </Chip>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onApprove(Number(row.key.replace("company-", "")))}
                    disabled={isApproving}
                    className="inline-flex items-center gap-1.5 rounded-full bg-chip-solid px-3 py-1.5 text-xs font-semibold text-chip-solid-fg disabled:opacity-60"
                  >
                    <CheckCircle2 aria-hidden="true" className="size-3.5" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onReject(Number(row.key.replace("company-", "")))}
                    disabled={isRejecting}
                    className="inline-flex items-center gap-1.5 rounded-full bg-chip-alert px-3 py-1.5 text-xs font-semibold text-chip-alert-fg disabled:opacity-60"
                  >
                    <XCircle aria-hidden="true" className="size-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ) : null,
  );
}

function humanize(value: string) {
  if (!value) return "—";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^./, (character) => character.toUpperCase());
}

function shortDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}
