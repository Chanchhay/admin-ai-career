"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Ban,
  Check,
  ExternalLink,
  FileText,
  RotateCcw,
  ShieldCheck,
  Undo2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { CompanyStatusChip } from "@/components/console/StatusChip";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CompanyIdentityPanel } from "@/components/console/CompanyIdentityPanel";
import { CompanyJobsPanel } from "@/components/console/CompanyJobsPanel";
import { BillCompanyPanel } from "@/components/finance/BillCompanyPanel";
import { StartConversation } from "@/components/messages/StartConversation";
import { GhostChip, Panel, PanelHeader } from "@/components/workspace/primitives";
import type {
  CompanyVerificationResponse,
  CompanyVerificationStatus,
  ModeratorCompanyDetailResponse,
} from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { resolveFileUrl } from "@/lib/file-url";
import { formatDateTime, humanizeEnum, orDash } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useDecideCompanyMutation, useGetCompanyQuery } from "@/services/moderationApi";
import { isUuid } from "@/lib/uuid";

type Decision =
  | "approve"
  | "reject"
  | "request-revision"
  | "suspend"
  | "reinstate";

export default function CompanyDetailPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const id = companyId;

  const { data, isLoading, isError, refetch } = useGetCompanyQuery(id, {
    skip: !isUuid(id),
  });

  useSetPageHeading(data?.company.name ?? "Company");

  if (isLoading) return <LoadingState rows={6} />;
  if (isError || !data) {
    return (
      <ErrorState message="Unable to load this company." onRetry={refetch} />
    );
  }

  const { company, documents, verificationHistory } = data;
  const logo = resolveFileUrl(company.logoUrl);
  // The backend orders the history newest first, so the head of the list is
  // the decision currently in force.
  const latest = verificationHistory[0] ?? null;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/companies"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-ws-faint transition-colors hover:bg-ws-card hover:text-ws-fg"
          aria-label="Back to companies"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </Link>

        <span
          className="size-14 shrink-0 rounded-xl bg-ws-card bg-cover bg-center ring-1 ring-ws-line"
          style={logo ? { backgroundImage: `url("${logo}")` } : undefined}
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-semibold tracking-tight text-ws-fg">
            {company.name}
          </h2>
          <p className="truncate text-sm text-ws-faint">
            {orDash(company.industryName)} · {orDash(company.contactEmail)}
          </p>
        </div>

        <CompanyStatusChip status={company.verificationStatus} />
        <GhostChip>{humanizeEnum(company.status)}</GhostChip>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-4">
          <DecisionPanel
            companyId={id}
            status={company.verificationStatus}
            latest={latest}
          />

          {/* What this company has put in front of candidates, next to the
              standing that lets it. */}
          <CompanyJobsPanel companyId={id} />

          {/* The evidence and the record of what was decided about it, read
              side by side once there is room for two columns — stretched to
              full width apiece they are mostly empty space. */}
          <div className="grid items-start gap-4 2xl:grid-cols-2">
            <DocumentsPanel documents={documents} />
            <HistoryPanel history={verificationHistory} />
          </div>

          <BillCompanyPanel companyId={id} />
        </div>

        <aside className="flex flex-col gap-4">
          <Panel variant="outlined">
            <PanelHeader title="Details" />
            <dl className="divide-y divide-ws-line">
              <Row label="Registration no." value={company.businessRegistrationNo} />
              <Row label="Email" value={company.contactEmail} />
              <Row label="Phone" value={company.contactPhone} />
              <Row label="Website" value={company.websiteUrl} href={company.websiteUrl} />
              <Row label="Industry" value={company.industryName} />
              <Row label="Address" value={company.address} />
            </dl>

            {company.description ? (
              <p className="mt-3 border-t border-ws-line pt-3 text-xs text-ws-muted">
                {company.description}
              </p>
            ) : null}
          </Panel>

          <CompanyIdentityPanel
            companyId={id}
            companyName={company.name}
            visibility={company.identityVisibility}
            maskedLogoUrl={company.maskedLogoUrl}
          />

          <StartConversation
            companyId={id}
            label="Message recruiter"
            recipientName={company.name}
          />
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ decision --- */

/**
 * The verification controls, shaped by where the company already stands.
 *
 * A company waiting on a decision gets the form outright — that is the whole
 * job of the screen. One that has already been decided gets its outcome
 * instead, and has to be reopened before the form comes back: an approved
 * company is settled, and leaving a live Reject button under it invites the
 * one action nobody came here to take.
 */
function DecisionPanel({
  companyId,
  status,
  latest,
}: {
  companyId: string;
  status: CompanyVerificationStatus;
  latest: CompanyVerificationResponse | null;
}) {
  const [decide, { isLoading: isDeciding }] = useDecideCompanyMutation();
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  const pending = status === "PENDING_VERIFICATION";
  const approved = status === "APPROVED";
  const suspended = status === "SUSPENDED";
  const editing = pending || open;

  // Reinstating gives something back rather than taking it away, so it is the
  // one decision that does not owe the recruiter an explanation.
  const NOTE_OPTIONAL: Decision[] = ["approve", "reinstate"];

  const submit = async (decision: Decision) => {
    // The note is the only record of *why*, and anything that costs the
    // recruiter something leaves them something to act on. The backend
    // rejects a blank note on those as well.
    if (!NOTE_OPTIONAL.includes(decision) && !note.trim()) {
      toast.error("Explain the decision in the note first.");
      return;
    }

    try {
      await decide({
        companyId,
        decision,
        body: note.trim() ? { decisionNote: note.trim() } : undefined,
      }).unwrap();
      setNote("");
      setOpen(false);
      toast.success(`Decision recorded: ${humanizeEnum(decision)}.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to record the decision."));
    }
  };

  return (
    <Panel
      variant="outlined"
      // Pending is the one state that is a task rather than a record, so it
      // gets the only accent on the page.
      className={cn(pending && "border-brand/40 bg-brand-tint/40")}
    >
      <PanelHeader
        title="Verification"
        icon={<ShieldCheck aria-hidden="true" className="size-4" />}
        action={
          pending ? null : editing ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setOpen(false);
                setNote("");
              }}
            >
              <X aria-hidden="true" /> Cancel
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              Change decision
            </Button>
          )
        }
      />

      {pending ? (
        <p className="mb-3 text-sm leading-6 text-ws-muted">
          This company is waiting on a decision. Approving lets its recruiters
          publish jobs; a rejection or a revision request needs a note, which is
          all the recruiter will see.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-ws-fg">
            {approved
              ? "Approved — recruiters at this company can publish jobs."
              : suspended
                ? "Suspended — its jobs are hidden from candidates and no new ones can be published."
                : "Rejected — recruiters at this company cannot publish jobs."}
          </p>
          {latest ? (
            <p className="text-xs text-ws-faint">
              {formatDateTime(latest.verifiedAt)}
              {latest.note ? ` · ${latest.note}` : ""}
            </p>
          ) : null}
        </div>
      )}

      {editing ? (
        <div className={pending ? undefined : "mt-3 border-t border-ws-line pt-3"}>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted">
            Note to the recruiter
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder={
                approved
                  ? "Why this company is losing its standing."
                  : suspended
                    ? "Optional — why the suspension is being lifted."
                    : "What was checked, and what is missing if anything."
              }
            />
          </label>

          {/* Only the moves that are legal from here. Suspending needs an
              approval to withdraw, and reinstating needs a suspension to lift;
              the API answers 409 either way, but a button that cannot work
              should not be on screen to begin with. */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {suspended ? (
              <Button disabled={isDeciding} onClick={() => void submit("reinstate")}>
                <Undo2 aria-hidden="true" /> Reinstate
              </Button>
            ) : approved ? (
              <Button
                variant="destructive"
                disabled={isDeciding}
                onClick={() => void submit("suspend")}
              >
                <Ban aria-hidden="true" /> Suspend
              </Button>
            ) : (
              <Button disabled={isDeciding} onClick={() => void submit("approve")}>
                <Check aria-hidden="true" /> Approve
              </Button>
            )}

            <Button
              variant="secondary"
              disabled={isDeciding}
              onClick={() => void submit("request-revision")}
            >
              <RotateCcw aria-hidden="true" /> Request revision
            </Button>

            {suspended ? null : (
              <Button
                variant="destructive"
                disabled={isDeciding}
                onClick={() => void submit("reject")}
              >
                <X aria-hidden="true" />
                {approved ? "Revoke approval" : "Reject"}
              </Button>
            )}
          </div>

          <p className="mt-2 text-xs text-ws-faint">
            {suspended
              ? "Reinstating returns the company to approved; its jobs come back on the next read."
              : approved
                ? "Suspending hides this company's jobs from candidates without deleting anything. A revision request sends it back to the pending queue."
                : "A revision request sends the company back to the pending queue."}
          </p>
        </div>
      ) : null}
    </Panel>
  );
}

/* ----------------------------------------------------------- documents --- */

function DocumentsPanel({
  documents,
}: {
  documents: ModeratorCompanyDetailResponse["documents"];
}) {
  return (
    <Panel variant="outlined" className="p-0">
      <div className="px-5 pt-5">
        <PanelHeader
          title={`Documents (${documents.length})`}
          icon={<FileText aria-hidden="true" className="size-4" />}
        />
      </div>

      {documents.length === 0 ? (
        <p className="px-5 pb-6 text-center text-sm text-ws-faint">
          No documents uploaded. There is nothing to verify against yet.
        </p>
      ) : (
        <ul className="border-t border-ws-line">
          {documents.map((document) => (
            <li
              key={document.id}
              className="border-b border-ws-line/70 last:border-0"
            >
              {/* A plain anchor: the file is served by the backend through the
                  gateway, not by a route of this app. */}
              <a
                href={resolveFileUrl(document.documentUrl)}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-ws-card"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-ws-card text-ws-muted">
                  <FileText aria-hidden="true" className="size-4" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ws-fg">
                    {humanizeEnum(document.documentType)}
                  </span>
                  <span className="block text-xs text-ws-faint">
                    Uploaded {formatDateTime(document.createdAt)}
                  </span>
                </span>

                <GhostChip>{humanizeEnum(document.status)}</GhostChip>

                <ExternalLink
                  aria-hidden="true"
                  className="size-4 shrink-0 text-ws-faint transition-colors group-hover:text-ws-fg"
                />
              </a>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------- history --- */

function HistoryPanel({
  history,
}: {
  history: ModeratorCompanyDetailResponse["verificationHistory"];
}) {
  if (history.length === 0) return null;

  return (
    <Panel variant="outlined">
      <PanelHeader title={`Decision history (${history.length})`} />

      <ol className="flex flex-col">
        {history.map((entry, index) => (
          <li key={entry.id} className="flex gap-3">
            {/* The rail: a dot per decision, joined by a line that stops at
                the last one so the timeline does not dangle. */}
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  entry.decision === "APPROVED" ||
                    entry.decision === "REINSTATED"
                    ? "bg-brand"
                    : entry.decision === "REJECTED" ||
                        entry.decision === "SUSPENDED"
                      ? "bg-error"
                      : "bg-ws-faint",
                )}
              />
              {index < history.length - 1 ? (
                <span className="w-px flex-1 bg-ws-line" />
              ) : null}
            </div>

            <div className={index < history.length - 1 ? "pb-4" : undefined}>
              <p className="text-sm font-medium text-ws-fg">
                {humanizeEnum(entry.decision)}
                <span className="ml-2 text-xs font-normal text-ws-faint">
                  {formatDateTime(entry.verifiedAt)}
                </span>
              </p>
              {entry.note ? (
                <p className="mt-0.5 text-sm leading-6 text-ws-muted">
                  {entry.note}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

/* ------------------------------------------------------------- details --- */

function Row({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const text = orDash(value);

  return (
    <div className="py-2">
      <dt className="text-xs text-ws-faint">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-medium text-ws-fg">
        {href && text !== "—" ? (
          <a
            href={href.startsWith("http") ? href : `https://${href}`}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            {text}
          </a>
        ) : (
          text
        )}
      </dd>
    </div>
  );
}
