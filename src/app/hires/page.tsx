"use client";

import { useState } from "react";
import { HandCoins } from "lucide-react";
import { toast } from "sonner";
import { HiringStatusChip } from "@/components/console/InvoiceStatusChip";
import { Pager } from "@/components/console/Pager";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  GhostChip,
  Panel,
  PanelHeader,
  PillTabs,
} from "@/components/workspace/primitives";
import type { HiringRecordResponse, HiringRecordStatus } from "@/contracts";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDate, orDash } from "@/lib/format";
import { formatMoney } from "@/lib/money";
import {
  useConfirmHireMutation,
  useGetHiringRecordsQuery,
  useRejectHireMutation,
} from "@/services/financeApi";

const TABS = ["Awaiting review", "Confirmed", "Rejected", "All"] as const;
type Tab = (typeof TABS)[number];

const tabStatus: Record<Tab, HiringRecordStatus | undefined> = {
  "Awaiting review": "REPORTED",
  Confirmed: "CONFIRMED",
  Rejected: "REJECTED",
  All: undefined,
};

export default function HiresPage() {
  const tx = useWorkspaceTranslation();
  useSetPageHeading(tx("Hires"));

  const [tab, setTab] = useState<Tab>("Awaiting review");
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, refetch } = useGetHiringRecordsQuery({
    status: tabStatus[tab],
    page,
  });

  const selectTab = (next: Tab) => {
    setTab(next);
    setPage(0);
  };

  const hires = data?.content ?? [];

  return (
    <div className="flex flex-col gap-5">
      <Panel tone="soft">
        <p className="text-sm leading-6">
          {tx(
            "Recruiters report their own hires, and they are also the party the commission is charged to. Confirming here is what creates that commission and marks the application as hired — so check the offer before you do.",
          )}
        </p>
      </Panel>

      <Panel>
        <PanelHeader
          title="Reported hires"
          icon={<HandCoins aria-hidden="true" className="size-5" />}
        />

        <PillTabs
          tabs={TABS}
          value={tab}
          onChange={selectTab}
          className="mb-4 rounded-full bg-ws-card-hover p-1"
        />

        {isLoading ? (
          <LoadingState rows={5} />
        ) : isError ? (
          <ErrorState message={tx("Unable to load hires.")} onRetry={refetch} />
        ) : hires.length === 0 ? (
          <p className="rounded-[22px] bg-ws-card-hover px-5 py-8 text-center text-sm text-ws-faint">
            {tx("Nothing here.")}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {hires.map((hire) => (
              <li key={hire.id}>
                <HireCard hire={hire} />
              </li>
            ))}
          </ul>
        )}

        {data ? <Pager page={data} onPageChange={setPage} /> : null}
      </Panel>
    </div>
  );
}

function HireCard({ hire }: { hire: HiringRecordResponse }) {
  const tx = useWorkspaceTranslation();
  const [confirmHire, confirmState] = useConfirmHireMutation();
  const [rejectHire, rejectState] = useRejectHireMutation();
  const [note, setNote] = useState("");

  const pending = confirmState.isLoading || rejectState.isLoading;
  const reviewable = hire.status === "REPORTED";

  async function act(action: "confirm" | "reject") {
    if (action === "reject" && !note.trim()) {
      toast.error(tx("Say why the report is being rejected."));
      return;
    }

    try {
      const body = { note: note.trim() || undefined };

      if (action === "confirm") {
        const result = await confirmHire({
          hiringRecordId: hire.id,
          body,
        }).unwrap();
        toast.success(
          tx("Confirmed. Commission {amount}.", {
            amount: formatMoney(
              result.commission?.commissionAmount ?? null,
              result.commission?.currency ?? null,
            ),
          }),
        );
      } else {
        await rejectHire({ hiringRecordId: hire.id, body }).unwrap();
        toast.success(tx("Report rejected."));
      }

      setNote("");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, tx("Unable to record the decision.")),
      );
    }
  }

  return (
    <div className="rounded-[18px] bg-ws-card-hover px-4 py-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ws-fg">
          {hire.jobTitle}
        </span>
        <HiringStatusChip status={hire.status} />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <GhostChip>{hire.companyName}</GhostChip>
        <GhostChip>{orDash(hire.candidateLabel)}</GhostChip>
        <GhostChip>
          {tx("Offer {amount}", {
            amount: formatMoney(hire.offeredSalary, hire.salaryCurrency),
          })}
        </GhostChip>
        <GhostChip>
          {tx("Reported {date}", { date: formatDate(hire.hiredAt) })}
        </GhostChip>
      </div>

      {hire.note ? (
        <p className="mt-2 text-xs text-ws-muted">{hire.note}</p>
      ) : null}

      {hire.commission ? (
        <p className="mt-2 text-xs font-semibold text-ws-fg">
          {hire.commission.invoiceNo
            ? tx("Commission {amount} at {rate}% · invoiced {invoiceNo}", {
                amount: formatMoney(
                  hire.commission.commissionAmount,
                  hire.commission.currency,
                ),
                rate: hire.commission.commissionRate,
                invoiceNo: hire.commission.invoiceNo,
              })
            : tx("Commission {amount} at {rate}% · not yet invoiced", {
                amount: formatMoney(
                  hire.commission.commissionAmount,
                  hire.commission.currency,
                ),
                rate: hire.commission.commissionRate,
              })}
        </p>
      ) : null}

      {hire.reviewNote ? (
        <p className="mt-2 text-xs text-ws-faint">{hire.reviewNote}</p>
      ) : null}

      {reviewable ? (
        <div className="mt-3 flex flex-col gap-2">
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={tx("Decision note (required to reject)")}
            rows={2}
            maxLength={2000}
          />
          <div className="flex gap-2 max-lg:flex-wrap">
            <Button disabled={pending} onClick={() => void act("confirm")}>
              {confirmState.isLoading ? tx("Confirming…") : tx("Confirm hire")}
            </Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() => void act("reject")}
            >
              {tx("Reject")}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
