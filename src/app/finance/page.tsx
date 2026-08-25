"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Percent, ReceiptText, Wallet } from "lucide-react";
import { toast } from "sonner";
import { InvoiceStatusChip } from "@/components/console/InvoiceStatusChip";
import { Pager } from "@/components/console/Pager";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GhostChip,
  Panel,
  PanelHeader,
  PillTabs,
} from "@/components/workspace/primitives";
import type { InvoiceStatus } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDate } from "@/lib/format";
import { formatMoney } from "@/lib/money";
import {
  useGetFinanceSettingsQuery,
  useGetInvoicesQuery,
  useUpdateFinanceSettingsMutation,
} from "@/services/financeApi";

const TABS = ["All", "Draft", "Issued", "Paid", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

const tabStatus: Record<Tab, InvoiceStatus | undefined> = {
  All: undefined,
  Draft: "DRAFT",
  Issued: "ISSUED",
  Paid: "PAID",
  Cancelled: "CANCELLED",
};

export default function FinancePage() {
  useSetPageHeading("Finance");

  const [tab, setTab] = useState<Tab>("All");
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, refetch } = useGetInvoicesQuery({
    status: tabStatus[tab],
    page,
  });

  const invoices = data?.content ?? [];

  return (
    <div className="flex flex-col gap-5">
      <SettingsPanel />

      <Panel>
        <PanelHeader
          title="Invoices"
          icon={<ReceiptText aria-hidden="true" className="size-5" />}
        />

        <PillTabs
          tabs={TABS}
          value={tab}
          onChange={(next) => {
            setTab(next);
            setPage(0);
          }}
          className="mb-4 rounded-full bg-ws-card-hover p-1"
        />

        {isLoading ? (
          <LoadingState rows={5} />
        ) : isError ? (
          <ErrorState message="Unable to load invoices." onRetry={refetch} />
        ) : invoices.length === 0 ? (
          <p className="rounded-[22px] bg-ws-card-hover px-5 py-8 text-center text-sm text-ws-faint">
            No invoices here. Bill a company from its confirmed hires.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {invoices.map((invoice) => (
              <li key={invoice.id}>
                <Link
                  href={`/finance/invoices/${invoice.id}`}
                  className="flex items-center gap-3 rounded-[18px] bg-ws-card-hover px-4 py-3.5 transition-colors hover:bg-ws-panel"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ws-fg">
                      {invoice.invoiceNo}
                    </span>
                    <span className="block truncate text-xs text-ws-faint">
                      {invoice.companyName} · due {formatDate(invoice.dueAt)}
                    </span>
                  </span>

                  <GhostChip>
                    {formatMoney(invoice.totalAmount, invoice.currency)}
                  </GhostChip>
                  <InvoiceStatusChip status={invoice.status} />
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-ws-faint"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {data ? <Pager page={data} onPageChange={setPage} /> : null}
      </Panel>
    </div>
  );
}

/**
 * The platform commission rate and payment terms.
 *
 * Changing these affects future hires only — a commission freezes its rate when
 * the hire is confirmed, so nothing already billed is restated.
 */
function SettingsPanel() {
  const { data, isLoading } = useGetFinanceSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateFinanceSettingsMutation();

  const [rate, setRate] = useState<string | null>(null);
  const [terms, setTerms] = useState<string | null>(null);

  if (isLoading || !data) return null;

  const rateValue = rate ?? String(data.commissionRate);
  const termsValue = terms ?? String(data.paymentTermsDays);
  const changed =
    rateValue !== String(data.commissionRate) ||
    termsValue !== String(data.paymentTermsDays);

  async function save() {
    const commissionRate = Number(rateValue);
    const paymentTermsDays = Number(termsValue);

    if (!Number.isFinite(commissionRate) || commissionRate < 0 || commissionRate > 100) {
      toast.error("The commission rate must be between 0 and 100.");
      return;
    }

    if (!Number.isInteger(paymentTermsDays) || paymentTermsDays < 0) {
      toast.error("Payment terms must be a whole number of days.");
      return;
    }

    try {
      await updateSettings({
        commissionRate,
        paymentTermsDays,
        currency: data!.currency,
      }).unwrap();
      toast.success("Finance settings saved.");
      setRate(null);
      setTerms(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save the settings."));
    }
  }

  return (
    <Panel>
      <PanelHeader
        title="Billing settings"
        icon={<Percent aria-hidden="true" className="size-5" />}
      />

      <p className="mb-4 text-sm text-ws-muted">
        Applied to hires confirmed from now on. Commissions already calculated
        keep the rate they were created with.
      </p>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ws-muted">
            Commission rate (%)
          </span>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={rateValue}
            onChange={(event) => setRate(event.target.value)}
            className="w-32"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ws-muted">
            Payment terms (days)
          </span>
          <Input
            type="number"
            min="0"
            max="365"
            value={termsValue}
            onChange={(event) => setTerms(event.target.value)}
            className="w-32"
          />
        </label>

        <GhostChip>
          <Wallet aria-hidden="true" className="size-3.5" /> {data.currency}
        </GhostChip>

        <Button disabled={!changed || isSaving} onClick={() => void save()}>
          {isSaving ? "Saving…" : "Save"}
        </Button>
      </div>
    </Panel>
  );
}
