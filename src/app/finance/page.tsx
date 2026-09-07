"use client";

import Link from "next/link";
import { useState } from "react";
import { HandCoins, Percent, Search, Wallet } from "lucide-react";
import { toast } from "sonner";
import {
  HiringStatusChip,
  InvoiceStatusChip,
} from "@/components/console/InvoiceStatusChip";
import { PageSizeSelect } from "@/components/console/PageSizeSelect";
import { Pager } from "@/components/console/Pager";
import { FinanceSummary } from "@/components/finance/FinanceSummary";
import { ReadyToBillPanel } from "@/components/finance/ReadyToBillPanel";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GhostChip, PillTabs } from "@/components/workspace/primitives";
import type {
  HiringRecordResponse,
  HiringRecordStatus,
  InvoiceResponse,
  InvoiceStatus,
} from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDate, orDash } from "@/lib/format";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import {
  useConfirmHireMutation,
  useGetBillableCompaniesQuery,
  useGetFinanceSettingsQuery,
  useGetHiringRecordsQuery,
  useGetInvoicesQuery,
  useRejectHireMutation,
  useUpdateFinanceSettingsMutation,
} from "@/services/financeApi";

/**
 * Hires and money on one screen.
 *
 * They were two sections, but they are one pipeline: a reported hire is
 * confirmed, which creates a commission, which is billed on an invoice, which
 * is paid. Splitting it across tabs meant checking two places to answer "what
 * is owed and why".
 */

const HIRE_TABS = ["Awaiting review", "Confirmed", "Rejected", "All"] as const;
type HireTab = (typeof HIRE_TABS)[number];

const hireStatus: Record<HireTab, HiringRecordStatus | undefined> = {
  "Awaiting review": "REPORTED",
  Confirmed: "CONFIRMED",
  Rejected: "REJECTED",
  All: undefined,
};

const INVOICE_TABS = ["All", "Draft", "Issued", "Partially paid", "Overdue", "Paid", "Cancelled"] as const;
type InvoiceTab = (typeof INVOICE_TABS)[number];

const invoiceStatus: Record<InvoiceTab, InvoiceStatus | undefined> = {
  All: undefined,
  Draft: "DRAFT",
  Issued: "ISSUED",
  "Partially paid": "PARTIALLY_PAID",
  Overdue: "OVERDUE",
  Paid: "PAID",
  Cancelled: "CANCELLED",
};

export default function FinancePage() {
  useSetPageHeading("Finance");

  const [view, setView] = useState<"Summary" | "Invoices" | "Hire review">("Summary");
  const [company, setCompany] = useState<{ id: string; name: string } | null>(null);
  const [billing, setBilling] = useState(false);
  const [settings, setSettings] = useState(false);

  const billable = useGetBillableCompaniesQuery();
  const readyCount = billable.data?.length ?? 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={() => setBilling(true)}>
          <HandCoins aria-hidden="true" /> Ready to bill
          {readyCount > 0 ? (
            <span className="ml-1 rounded-md bg-chip-solid px-1.5 py-0.5 text-xs font-semibold text-chip-solid-fg tabular-nums">
              {readyCount}
            </span>
          ) : null}
        </Button>

        <Button variant="outline" onClick={() => setSettings(true)}>
          <Percent aria-hidden="true" /> Billing settings
        </Button>
      </div>

      <PillTabs
        tabs={["Summary", "Invoices", "Hire review"]}
        value={view}
        onChange={setView}
        className="shrink-0 rounded-lg bg-ws-card p-1"
      />

      <div hidden={view !== "Summary"}>
        <FinanceSummary onOpenCompany={(selected) => {
          setCompany(selected);
          setView("Invoices");
        }} />
      </div>
      {view !== "Summary" ? (
        <>
          <Summary
            view={view === "Hire review" ? "hires" : "invoices"}
            onSelect={(next) => setView(next === "hires" ? "Hire review" : "Invoices")}
          />
          {view === "Hire review" ? <HiresTable /> : (
            <>
              {company ? (
                <div className="flex items-center justify-between gap-2 rounded-lg border border-ws-line px-4 py-2 text-sm">
                  <span>Invoices for <strong>{company.name}</strong></span>
                  <Button variant="ghost" size="sm" onClick={() => setCompany(null)}>All companies</Button>
                </div>
              ) : null}
              <InvoicesTable key={company?.id ?? "all"} companyId={company?.id} />
            </>
          )}
        </>
      ) : null}

      {/* Both were panels stacked under the tables, where they were read once
          and then sat in the way of the work. They are errands, not reading. */}
      <Dialog
        open={billing}
        onOpenChange={setBilling}
        title="Ready to bill"
        description="Companies holding commissions no invoice has picked up yet."
        className="w-[min(46rem,calc(100vw-2rem))]"
      >
        <ReadyToBillPanel bare />
      </Dialog>

      <Dialog
        open={settings}
        onOpenChange={setSettings}
        title="Billing settings"
        description="Applied to hires confirmed from now on. Commissions already calculated keep the rate they were created with."
      >
        <SettingsForm />
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------------------- summary --- */

/**
 * The pipeline, as four numbers — and the switch between the two tables.
 *
 * Each is its own `totalElements` read at `size=1`, the cheapest count this
 * API gives for the operational hire/invoice queues.
 */
function Summary({
  view,
  onSelect,
}: {
  view: "hires" | "invoices";
  onSelect: (view: "hires" | "invoices") => void;
}) {
  const awaiting = useGetHiringRecordsQuery({
    status: "REPORTED",
    page: 0,
    size: 1,
  });
  const confirmed = useGetHiringRecordsQuery({
    status: "CONFIRMED",
    page: 0,
    size: 1,
  });
  const issued = useGetInvoicesQuery({ status: "ISSUED", page: 0, size: 1 });
  const paid = useGetInvoicesQuery({ status: "PAID", page: 0, size: 1 });

  const cells = [
    {
      key: "awaiting",
      label: "Awaiting review",
      value: awaiting.data?.totalElements,
      dot: "bg-warning",
      view: "hires" as const,
    },
    {
      key: "confirmed",
      label: "Confirmed hires",
      value: confirmed.data?.totalElements,
      dot: "bg-brand",
      view: "hires" as const,
    },
    {
      key: "issued",
      label: "Issued invoices",
      value: issued.data?.totalElements,
      dot: "bg-warning",
      view: "invoices" as const,
    },
    {
      key: "paid",
      label: "Paid invoices",
      value: paid.data?.totalElements,
      dot: "bg-brand",
      view: "invoices" as const,
    },
  ];

  return (
    <div className="grid shrink-0 grid-cols-2 gap-px overflow-hidden rounded-xl border border-ws-line bg-ws-line lg:grid-cols-4">
      {cells.map((cell) => (
        <button
          key={cell.key}
          type="button"
          onClick={() => onSelect(cell.view)}
          aria-pressed={view === cell.view}
          className={cn(
            "flex flex-col gap-1 px-4 py-3 text-left transition-colors",
            view === cell.view
              ? "bg-ws-card"
              : "bg-ws-panel hover:bg-ws-card/60",
          )}
        >
          <span className="flex items-center gap-2 text-xs font-medium text-ws-muted">
            <span
              aria-hidden="true"
              className={`size-2 shrink-0 rounded-full ${cell.dot}`}
            />
            {cell.label}
          </span>
          <span className="text-2xl font-semibold tabular-nums text-ws-fg">
            {cell.value === undefined ? "—" : cell.value.toLocaleString()}
          </span>
        </button>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- hires --- */

/*
 * Widths sized to the widest thing each column actually holds — "Decision
 * pending" in a chip, or a chip beside two buttons — rather than to the header
 * word. A `table-fixed` column narrower than its content does not wrap it, it
 * pushes it out of the cell and the card's rounded edge clips it off.
 */
const HIRE_COLUMNS = [
  { key: "job", label: "Hire", className: "w-[24%]" },
  { key: "company", label: "Company", className: "w-[15%]" },
  { key: "offer", label: "Offer", className: "w-[11%]" },
  { key: "commission", label: "Commission", className: "w-[17%]" },
  { key: "reported", label: "Reported", className: "w-[11%]" },
  { key: "status", label: "Status", className: "w-[22%]" },
] as const;

function HiresTable() {
  const [tab, setTab] = useState<HireTab>("Awaiting review");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [filter, setFilter] = useState("");

  const { data, isLoading, isError, refetch } = useGetHiringRecordsQuery({
    status: hireStatus[tab],
    page,
    size,
  });

  const hires = data?.content ?? [];
  const needle = filter.trim().toLowerCase();
  const rows = needle
    ? hires.filter((hire) =>
        `${hire.jobTitle} ${hire.companyName} ${hire.candidateLabel ?? ""}`
          .toLowerCase()
          .includes(needle),
      )
    : hires;

  return (
    <TableCard
      title="Reported hires"
      note="Recruiters report their own hires and are the party the commission is charged to. Confirming is what creates that commission."
      tabs={
        <PillTabs
          tabs={HIRE_TABS}
          value={tab}
          onChange={(next) => {
            setTab(next);
            setPage(0);
          }}
          className="rounded-lg bg-ws-card p-1"
        />
      }
      filter={filter}
      onFilter={setFilter}
      columns={HIRE_COLUMNS}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      empty={rows.length === 0}
      emptyLabel="No hires in this queue."
      page={data}
      onPageChange={setPage}
      size={size}
      onSize={(next) => {
        setSize(next);
        setPage(0);
      }}
      sizeId="hires-page-size"
    >
      {rows.map((hire) => (
        <HireRow key={hire.id} hire={hire} />
      ))}
    </TableCard>
  );
}

function HireRow({ hire }: { hire: HiringRecordResponse }) {
  const [confirmHire, confirmState] = useConfirmHireMutation();
  const [rejectHire, rejectState] = useRejectHireMutation();
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");

  const busy = confirmState.isLoading || rejectState.isLoading;
  const reviewable = hire.status === "REPORTED";

  async function confirm() {
    try {
      const result = await confirmHire({
        hiringRecordId: hire.id,
        body: {},
      }).unwrap();
      toast.success(
        `Confirmed. Commission ${formatMoney(
          result.commission?.commissionAmount ?? null,
          result.commission?.currency ?? null,
        )}.`,
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to confirm this hire."));
    }
  }

  async function reject() {
    if (!note.trim()) {
      toast.error("Say why the report is being rejected.");
      return;
    }

    try {
      await rejectHire({
        hiringRecordId: hire.id,
        body: { note: note.trim() },
      }).unwrap();
      toast.success("Report rejected.");
      setNote("");
      setRejecting(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to reject this report."));
    }
  }

  return (
    <tr className="border-b border-ws-line/70 transition-colors hover:bg-ws-card/60">
      <td className="px-4 py-3">
        <span className="block truncate text-sm font-medium text-ws-fg">
          {orDash(hire.jobTitle)}
        </span>
        <span className="block truncate text-xs text-ws-faint">
          {orDash(hire.candidateLabel)}
        </span>
      </td>

      <td className="truncate px-4 py-3 text-sm text-ws-muted">
        {orDash(hire.companyName)}
      </td>

      <td className="px-4 py-3 text-sm tabular-nums text-ws-fg">
        {formatMoney(hire.offeredSalary, hire.salaryCurrency)}
      </td>

      <td className="px-4 py-3">
        {hire.commission ? (
          <span className="block text-sm tabular-nums text-ws-fg">
            {formatMoney(
              hire.commission.commissionAmount,
              hire.commission.currency,
            )}
            <span className="ml-1 text-xs text-ws-faint">
              at {hire.commission.commissionRate}%
            </span>
            <span className="block text-xs text-ws-faint">
              {hire.commission.invoiceNo
                ? `Invoiced ${hire.commission.invoiceNo}`
                : "Not yet invoiced"}
            </span>
          </span>
        ) : (
          <span className="text-xs text-ws-faint">None yet</span>
        )}
      </td>

      <td className="px-4 py-3 text-sm text-ws-muted">
        {formatDate(hire.hiredAt)}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <HiringStatusChip status={hire.status} />

          {reviewable ? (
            <span className="flex items-center gap-1.5">
              <Button size="sm" disabled={busy} onClick={() => void confirm()}>
                Confirm
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={busy}
                onClick={() => setRejecting(true)}
              >
                Reject
              </Button>
            </span>
          ) : null}
        </div>

        {/* A modal rather than an expanding row: the note is about the row you
            just clicked, and growing the table would move it under the cursor. */}
        <Dialog
          open={rejecting}
          onOpenChange={setRejecting}
          title="Reject this hire report"
          description={`${hire.jobTitle} at ${hire.companyName}. The recruiter sees the reason.`}
        >
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Why is this report being rejected?"
          />
          <div className="mt-3 flex gap-2">
            <Button
              variant="destructive"
              disabled={busy}
              onClick={() => void reject()}
            >
              Reject report
            </Button>
            <Button variant="ghost" onClick={() => setRejecting(false)}>
              Cancel
            </Button>
          </div>
        </Dialog>
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------ invoices --- */

const INVOICE_COLUMNS = [
  { key: "no", label: "Invoice", className: "w-[21%]" },
  { key: "company", label: "Company", className: "w-[19%]" },
  { key: "issued", label: "Issued", className: "w-[11%]" },
  { key: "due", label: "Due", className: "w-[11%]" },
  { key: "total", label: "Total", className: "w-[11%]" },
  { key: "outstanding", label: "Outstanding", className: "w-[13%]" },
  { key: "status", label: "Status", className: "w-[14%]" },
] as const;

function InvoicesTable({ companyId }: { companyId?: string }) {
  const [tab, setTab] = useState<InvoiceTab>("All");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [filter, setFilter] = useState("");

  const { data, isLoading, isError, refetch } = useGetInvoicesQuery({
    companyId,
    status: invoiceStatus[tab],
    page,
    size,
  });

  const invoices = data?.content ?? [];
  const needle = filter.trim().toLowerCase();
  const rows = needle
    ? invoices.filter((invoice) =>
        `${invoice.invoiceNo} ${invoice.companyName}`
          .toLowerCase()
          .includes(needle),
      )
    : invoices;

  return (
    <TableCard
      title="Invoices"
      note="A draft is private until it is issued. Issuing is what the recruiter sees."
      tabs={
        <PillTabs
          tabs={INVOICE_TABS}
          value={tab}
          onChange={(next) => {
            setTab(next);
            setPage(0);
          }}
          className="rounded-lg bg-ws-card p-1"
        />
      }
      filter={filter}
      onFilter={setFilter}
      columns={INVOICE_COLUMNS}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      empty={rows.length === 0}
      emptyLabel="No invoices here yet."
      page={data}
      onPageChange={setPage}
      size={size}
      onSize={(next) => {
        setSize(next);
        setPage(0);
      }}
      sizeId="invoices-page-size"
    >
      {rows.map((invoice) => (
        <InvoiceRow key={invoice.id} invoice={invoice} />
      ))}
    </TableCard>
  );
}

function InvoiceRow({ invoice }: { invoice: InvoiceResponse }) {
  return (
    <tr className="border-b border-ws-line/70 transition-colors hover:bg-ws-card/60">
      <td className="px-4 py-3">
        <Link
          href={`/finance/invoices/${invoice.id}`}
          className="block truncate font-medium text-ws-fg hover:underline"
        >
          {invoice.invoiceNo}
        </Link>
        <span className="block truncate text-xs text-ws-faint">
          {invoice.items.length} {invoice.items.length === 1 ? "line" : "lines"}
        </span>
      </td>

      <td className="truncate px-4 py-3 text-sm text-ws-muted">
        {orDash(invoice.companyName)}
      </td>

      <td className="px-4 py-3 text-sm text-ws-muted">
        {invoice.issuedAt ? formatDate(invoice.issuedAt) : "—"}
      </td>

      <td className="px-4 py-3 text-sm text-ws-muted">
        {invoice.dueAt ? formatDate(invoice.dueAt) : "—"}
      </td>

      <td className="px-4 py-3 text-sm font-medium tabular-nums text-ws-fg">
        {formatMoney(invoice.totalAmount, invoice.currency)}
      </td>

      <td className="px-4 py-3 text-sm tabular-nums text-ws-fg">
        {invoice.status !== "CANCELLED" && invoice.outstandingAmount > 0 ? (
          formatMoney(invoice.outstandingAmount, invoice.currency)
        ) : (
          <span className="text-ws-faint">—</span>
        )}
      </td>

      <td className="px-4 py-3">
        <InvoiceStatusChip status={invoice.status} />
      </td>
    </tr>
  );
}

/* ---------------------------------------------------------------- card --- */

/** The shell both tables share: toolbar, sticky head, footer. */
function TableCard<T>({
  title,
  note,
  tabs,
  filter,
  onFilter,
  columns,
  isLoading,
  isError,
  onRetry,
  empty,
  emptyLabel,
  page,
  onPageChange,
  size,
  onSize,
  sizeId,
  children,
}: {
  title: string;
  note: string;
  tabs: React.ReactNode;
  filter: string;
  onFilter: (value: string) => void;
  columns: readonly { key: string; label: string; className: string }[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  empty: boolean;
  emptyLabel: string;
  page:
    | Pick<
        import("@/contracts").Page<T>,
        "number" | "totalPages" | "totalElements" | "first" | "last"
      >
    | undefined;
  onPageChange: (page: number) => void;
  size: number;
  onSize: (size: number) => void;
  sizeId: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-ws-line bg-ws-panel">
      <div className="flex shrink-0 flex-wrap items-center gap-3 px-4 py-3">
        <h2 className="font-semibold text-ws-fg">{title}</h2>
        {page ? (
          <span className="rounded-md bg-ws-card px-2 py-0.5 text-xs font-medium text-ws-muted">
            {page.totalElements}
          </span>
        ) : null}

        <div className="relative ml-auto w-full sm:w-72">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ws-faint"
          />
          <Input
            value={filter}
            onChange={(event) => onFilter(event.target.value)}
            placeholder="Search this page"
            className="pl-9"
          />
        </div>
      </div>

      <div className="shrink-0 px-4 pb-3">{tabs}</div>

      {/* The scroller is this pane, not the page: the toolbar stays put and
          the footer stays on the bottom edge however many rows there are. */}
      <div className="ws-scroll min-h-0 flex-1 overflow-auto border-t border-ws-line">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`${column.className} bg-ws-card px-4 py-2.5 text-xs font-semibold text-ws-muted shadow-[inset_0_-1px_0_var(--ws-line)]`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-4">
                  <LoadingState rows={5} />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={columns.length} className="p-4">
                  <ErrorState
                    message="Unable to load this list."
                    onRetry={onRetry}
                  />
                </td>
              </tr>
            ) : empty ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-14 text-center text-sm text-ws-faint"
                >
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-ws-line px-4 py-2.5">
        <PageSizeSelect value={size} onChange={onSize} id={sizeId} />
        <p className="hidden text-xs text-ws-faint lg:block">{note}</p>
        {page ? (
          <div className="ml-auto">
            <Pager page={page} onPageChange={onPageChange} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ settings --- */

function SettingsForm() {
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

    if (
      !Number.isFinite(commissionRate) ||
      commissionRate < 0 ||
      commissionRate > 100
    ) {
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
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-ws-muted">
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
        <span className="text-xs font-medium text-ws-muted">
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
  );
}
