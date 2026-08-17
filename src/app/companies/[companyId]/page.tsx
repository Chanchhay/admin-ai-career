"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  FileText,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { CompanyStatusChip } from "@/components/console/StatusChip";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Chip, GhostChip, Panel, PanelHeader } from "@/components/workspace/primitives";
import { getApiErrorMessage } from "@/lib/api-error";
import { resolveFileUrl } from "@/lib/file-url";
import { formatDateTime, humanizeEnum, orDash } from "@/lib/format";
import { useDecideCompanyMutation, useGetCompanyQuery } from "@/services/moderationApi";

type Decision = "approve" | "reject" | "request-revision";

export default function CompanyDetailPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const id = Number(companyId);

  const { data, isLoading, isError, refetch } = useGetCompanyQuery(id, {
    skip: Number.isNaN(id),
  });
  const [decide, { isLoading: isDeciding }] = useDecideCompanyMutation();
  const [note, setNote] = useState("");

  useSetPageHeading(data?.company.name ?? "Company");

  const submit = async (decision: Decision) => {
    // The note is the only record of *why*, and a rejection without one leaves
    // the recruiter nothing to act on.
    if (decision !== "approve" && !note.trim()) {
      toast.error("Explain the decision in the note first.");
      return;
    }

    try {
      await decide({
        companyId: id,
        decision,
        body: note.trim() ? { decisionNote: note.trim() } : undefined,
      }).unwrap();
      setNote("");
      toast.success(`Decision recorded: ${humanizeEnum(decision)}.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to record the decision."));
    }
  };

  if (isLoading) return <LoadingState rows={6} />;
  if (isError || !data) {
    return (
      <ErrorState message="Unable to load this company." onRetry={refetch} />
    );
  }

  const { company, documents, verificationHistory } = data;
  const logo = resolveFileUrl(company.logoUrl);
  const isFinalDecision =
    company.verificationStatus === "APPROVED" ||
    company.verificationStatus === "REJECTED" ||
    company.verificationStatus === "SUSPENDED";

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/companies"
        className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-ws-faint transition-colors hover:text-ws-fg"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Back to queue
      </Link>

      <Panel>
        <div className="flex flex-wrap items-start gap-4">
          <span
            className="size-14 shrink-0 rounded-2xl bg-ws-card-hover bg-cover bg-center"
            style={logo ? { backgroundImage: `url("${logo}")` } : undefined}
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold tracking-tight text-ws-fg">
              {company.name}
            </h2>
            <p className="mt-1 text-sm text-ws-faint">
              {orDash(company.industryName)}
            </p>
          </div>
          <CompanyStatusChip status={company.verificationStatus} />
        </div>

        {company.description ? (
          <p className="mt-4 text-sm leading-6 text-ws-muted">
            {company.description}
          </p>
        ) : null}

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Registration no." value={company.businessRegistrationNo} />
          <Field label="Contact email" value={company.contactEmail} />
          <Field label="Contact phone" value={company.contactPhone} />
          <Field label="Website" value={company.websiteUrl} />
          <Field label="Address" value={company.address} />
          <Field label="Profile status" value={humanizeEnum(company.status)} />
        </dl>
      </Panel>

      <Panel>
        <PanelHeader
          title={`Documents (${documents.length})`}
          icon={<FileText aria-hidden="true" className="size-5" />}
        />

        {documents.length === 0 ? (
          <p className="rounded-[22px] bg-ws-card-hover px-5 py-8 text-center text-sm text-ws-faint">
            No documents uploaded. There is nothing to verify against yet.
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {documents.map((document) => (
              <li key={document.id}>
                {/* A plain anchor: the file is served by the backend through
                    the gateway, not by a route of this app. */}
                <a
                  href={resolveFileUrl(document.documentUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-[18px] bg-ws-card-hover px-4 py-3.5 transition-colors hover:bg-ws-panel"
                >
                  <FileText aria-hidden="true" className="size-4 text-ws-muted" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ws-fg">
                      {orDash(document.documentType)}
                    </span>
                    <span className="block text-xs text-ws-faint">
                      Uploaded {formatDateTime(document.createdAt)}
                    </span>
                  </span>
                  <GhostChip>{humanizeEnum(document.status)}</GhostChip>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel>
        <PanelHeader
          title="Decision"
          icon={<ShieldCheck aria-hidden="true" className="size-5" />}
        />

        {isFinalDecision ? (
          <p className="rounded-[18px] bg-ws-card-hover px-4 py-3 text-sm text-ws-muted">
            This verification is {company.verificationStatus.toLowerCase()}. Review the history below for the recorded decision.
          </p>
        ) : (
          <>
            <label className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted">
              Note to the recruiter
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="What was checked, and what is missing if anything."
              />
            </label>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button disabled={isDeciding} onClick={() => void submit("approve")}>
                <Check aria-hidden="true" className="size-4" />
                Approve
              </Button>
              <Button variant="secondary" disabled={isDeciding} onClick={() => void submit("request-revision")}>
                <RotateCcw aria-hidden="true" className="size-4" />
                Request revision
              </Button>
              <Button variant="destructive" disabled={isDeciding} onClick={() => void submit("reject")}>
                <X aria-hidden="true" className="size-4" />
                Reject
              </Button>
            </div>
          </>
        )}
      </Panel>

      <Panel>
        <PanelHeader title={`History (${verificationHistory.length})`} />

        {verificationHistory.length === 0 ? (
          <p className="rounded-[22px] bg-ws-card-hover px-5 py-8 text-center text-sm text-ws-faint">
            No decision has been recorded yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {[...verificationHistory].reverse().map((entry) => (
              <li
                key={entry.id}
                className="rounded-[18px] bg-ws-card-hover px-4 py-3.5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone={entry.decision === "APPROVED" ? "solid" : entry.decision === "REJECTED" ? "alert" : "soft"}>
                    {humanizeEnum(entry.decision)}
                  </Chip>
                  <span className="text-xs text-ws-faint">
                    {formatDateTime(entry.verifiedAt)} · moderator #
                    {entry.moderatorProfileId}
                  </span>
                </div>
                {entry.note ? (
                  <p className="mt-2 text-sm leading-6 text-ws-muted">
                    {entry.note}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-ws-card-hover px-4 py-3">
      <dt className="text-[11px] uppercase tracking-[0.18em] text-ws-faint">
        {label}
      </dt>
      <dd className="mt-1.5 break-words text-sm font-semibold text-ws-fg">
        {orDash(value)}
      </dd>
    </div>
  );
}
