"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PillTabs } from "@/components/workspace/primitives";
import { Pager } from "@/components/console/Pager";
import { PageSizeSelect } from "@/components/console/PageSizeSelect";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { useGetFinanceSummaryQuery, useGetPayingCompaniesQuery } from "@/services/financeApi";
import type { FinanceReportPeriod, FinanceSummaryResponse } from "@/contracts";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const PERIODS = { Weekly: "WEEK", Monthly: "MONTH", Yearly: "YEAR" } as const;
type PeriodLabel = keyof typeof PERIODS;
const ZONE = "Asia/Phnom_Penh";

function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONE, year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

function moveDate(value: string, period: FinanceReportPeriod, direction: number) {
  const date = new Date(`${value}T12:00:00Z`);
  if (period === "WEEK") date.setUTCDate(date.getUTCDate() + direction * 7);
  else if (period === "MONTH") date.setUTCMonth(date.getUTCMonth() + direction, 1);
  else date.setUTCFullYear(date.getUTCFullYear() + direction, 0, 1);
  return date.toISOString().slice(0, 10);
}

function displayDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: ZONE, ...options,
  }).format(new Date(value.length === 10 ? `${value}T00:00:00+07:00` : value));
}

function rangeLabel(data: FinanceSummaryResponse) {
  if (data.period === "YEAR") return data.startDate.slice(0, 4);
  if (data.period === "MONTH") return displayDate(data.startDate, { day: undefined, month: "long" });
  const last = new Date(`${data.endDateExclusive}T00:00:00+07:00`);
  last.setUTCDate(last.getUTCDate() - 1);
  return `${displayDate(data.startDate)} – ${displayDate(last.toISOString())}`;
}

export function FinanceSummary({ onOpenCompany }: {
  onOpenCompany: (company: { id: string; name: string }) => void;
}) {
  const [periodLabel, setPeriodLabel] = useState<PeriodLabel>("Monthly");
  const [date, setDate] = useState(today);
  const [currency, setCurrency] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const period = PERIODS[periodLabel];
  const params = { period, date, currency: currency || undefined };
  const summary = useGetFinanceSummaryQuery(params, { refetchOnMountOrArgChange: true });
  const companies = useGetPayingCompaniesQuery({ ...params, search, page, size }, { refetchOnMountOrArgChange: true });
  const data = summary.currentData;
  const companyPage = companies.currentData;
  const busy = summary.isFetching || companies.isFetching;

  const changeDate = (next: string) => {
    if (!next || next < "1900-01-01" || next > "9998-12-31") return;
    setDate(next);
    setPage(0);
  };
  const refresh = () => { void summary.refetch(); void companies.refetch(); };

  return (
    <div className="flex flex-col gap-3">
      <section className="rounded-xl border border-ws-line bg-ws-panel p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-auto">
            <h2 className="text-lg font-semibold">Payment summary</h2>
            <p className="mt-1 text-xs text-ws-muted">Successful payments, including partial payments. Reports use Phnom Penh time.</p>
          </div>
          <PillTabs tabs={Object.keys(PERIODS) as PeriodLabel[]} value={periodLabel}
            onChange={(next) => { setPeriodLabel(next); setPage(0); }} className="rounded-lg bg-ws-card p-1" />
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" aria-label="Previous period"
              disabled={date <= "1900-01-07"} onClick={() => changeDate(moveDate(date, period, -1))}>
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button variant="outline" size="icon-sm" aria-label="Next period"
              disabled={date >= "9998-12-25"} onClick={() => changeDate(moveDate(date, period, 1))}>
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
          <label className="flex flex-col gap-1 text-xs text-ws-muted">
            Date within the period
            <Input type="date" min="1900-01-01" max="9998-12-31" value={date}
              onChange={(event) => changeDate(event.target.value)} className="h-9 w-40" />
          </label>
          <Button variant="ghost" size="sm" onClick={() => changeDate(today())}>Current period</Button>
          <div className="flex flex-col gap-1">
            <label htmlFor="finance-summary-currency" className="text-xs text-ws-muted">Currency</label>
            <Select id="finance-summary-currency" value={currency || data?.currency || ""}
              options={(data?.availableCurrencies ?? (currency ? [currency] : [])).map((code) => ({ value: code, label: code }))}
              placeholder="Loading…" onChange={(next) => { setCurrency(next); setPage(0); }} disabled={!data && !currency} />
          </div>
          <Button className="ml-auto" variant="ghost" size="sm" onClick={refresh} disabled={busy}>
            <RefreshCw aria-hidden="true" className={cn("size-4", busy && "animate-spin")} /> Refresh
          </Button>
        </div>
      </section>

      {summary.isError ? (
        <ErrorState message="Unable to load the payment summary." onRetry={summary.refetch} />
      ) : !data ? <LoadingState rows={5} /> : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <h3 className="font-semibold">{rangeLabel(data)}</h3>
            <span className="text-xs text-ws-faint">{busy ? "Updating…" : `Updated ${displayDate(data.generatedAt, { hour: "2-digit", minute: "2-digit" })}`}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Payments received" value={formatMoney(data.receivedAmount, data.currency)}
              detail={`${formatMoney(data.previousReceivedAmount, data.currency)} in the previous ${period === "WEEK" ? "week" : period === "MONTH" ? "month" : "year"}`} highlight />
            <Metric label="Companies that paid" value={data.payingCompanyCount.toLocaleString()}
              detail="Distinct companies in this period" />
            <Metric label="Successful payments" value={data.paymentCount.toLocaleString()}
              detail={`${data.invoiceCount} ${data.invoiceCount === 1 ? "invoice received" : "invoices received"} payments`} />
            <Metric label="Average payment" value={data.paymentCount ? formatMoney(data.receivedAmount / data.paymentCount, data.currency) : "—"}
              detail="Amount received per payment" />
          </div>
          <ReceiptTrend key={`${period}-${date}-${data.currency}`} data={data} />
          <section className="grid gap-3 sm:grid-cols-2">
            <Metric label="Outstanding now" value={formatMoney(data.outstandingAmount, data.currency)}
              detail={`${data.outstandingInvoiceCount} open invoices · all dates, excluding drafts and cancellations`} />
            <Metric label="Overdue now" value={formatMoney(data.overdueAmount, data.currency)}
              detail={`${data.overdueInvoiceCount} invoices past their due date · included in outstanding`} />
          </section>
          <p className="px-1 text-xs text-ws-faint">Current periods may still be in progress. Previous-period figures cover the full previous period. Currencies are reported separately.</p>
        </>
      )}

      <section className="overflow-hidden rounded-xl border border-ws-line bg-ws-panel">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          <div className="mr-auto">
            <h3 className="font-semibold">Companies that paid</h3>
            <p className="mt-1 text-xs text-ws-muted">Ranked by payments received in the selected period. Open a company’s invoices to review its bills.</p>
          </div>
          <form className="flex w-full gap-2 sm:w-auto" onSubmit={(event) => {
            event.preventDefault(); setSearch(searchInput.trim()); setPage(0);
          }}>
            <div className="relative min-w-0 flex-1">
              <Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ws-faint" />
              <Input aria-label="Search paying companies" placeholder="Search companies" maxLength={200}
                value={searchInput} onChange={(event) => setSearchInput(event.target.value)} className="pl-9" />
            </div>
            <Button type="submit" variant="secondary">Search</Button>
            {search ? <Button variant="ghost" type="button" onClick={() => { setSearch(""); setSearchInput(""); setPage(0); }}>Clear</Button> : null}
          </form>
        </div>
        <div className="ws-scroll overflow-auto border-t border-ws-line">
          <table className="w-full min-w-[780px] border-collapse text-left">
            <thead className="bg-ws-card text-xs text-ws-muted">
              <tr>{["Company", "Received", "Payments", "Invoices", "Last payment", "Actions"].map((heading) => (
                <th key={heading} scope="col" className="px-4 py-2.5 font-semibold">{heading}</th>
              ))}</tr>
            </thead>
            <tbody>
              {companies.isError ? <tr><td colSpan={6} className="p-4"><ErrorState message="Unable to load paying companies." onRetry={companies.refetch} /></td></tr>
                : !companyPage ? <tr><td colSpan={6} className="p-4"><LoadingState rows={4} /></td></tr>
                : companyPage.content.length === 0 ? <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-ws-faint">
                  {search ? "No paying companies match your search." : "No successful payments recorded for this period and currency."}
                </td></tr> : companyPage.content.map((company) => (
                  <tr key={company.companyId} className="border-b border-ws-line/70 text-sm hover:bg-ws-card/60">
                    <td className="max-w-64 truncate px-4 py-3 font-medium" title={company.companyName}>{company.companyName}</td>
                    <td className="px-4 py-3 font-semibold tabular-nums">{formatMoney(company.receivedAmount, company.currency)}</td>
                    <td className="px-4 py-3 tabular-nums text-ws-muted">{company.paymentCount}</td>
                    <td className="px-4 py-3 tabular-nums text-ws-muted">{company.invoiceCount}</td>
                    <td className="px-4 py-3 text-ws-muted">{displayDate(company.lastPaymentAt)}</td>
                    <td className="px-4 py-3"><Button size="sm" variant="ghost" onClick={() => onOpenCompany({ id: company.companyId, name: company.companyName })}>Invoices</Button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-ws-line px-4 py-2.5">
          <PageSizeSelect value={size} onChange={(next) => { setSize(next); setPage(0); }} id="finance-summary-page-size" />
          {companyPage ? <div className="ml-auto"><Pager page={companyPage} onPageChange={setPage} /></div> : null}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, detail, highlight = false }: {
  label: string; value: string; detail: string; highlight?: boolean;
}) {
  return <div className="rounded-xl border border-ws-line bg-ws-panel p-4">
    <p className="text-sm text-ws-muted">{label}</p>
    <p className={cn("mt-2 text-2xl font-semibold tabular-nums", highlight && "text-primary")}>{value}</p>
    <p className="mt-2 text-xs leading-5 text-ws-faint">{detail}</p>
  </div>;
}

function ReceiptTrend({ data }: { data: FinanceSummaryResponse }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.trend.map((point) => point.amount), 1);
  const selected = active == null ? null : data.trend[active];
  return <section className="rounded-xl border border-ws-line bg-ws-panel p-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="font-semibold">Payments over time</h3>
      <p className="text-xs text-ws-muted" aria-live="polite">
        {selected ? `${displayDate(selected.date, data.period === "YEAR" ? { day: undefined, month: "long" } : undefined)} · ${formatMoney(selected.amount, data.currency)} · ${selected.paymentCount} payments` : "Select a bar to see its payments"}
      </p>
    </div>
    <div className="ws-scroll mt-4 overflow-x-auto">
      <div className="flex h-44 min-w-[460px] items-stretch gap-1.5 border-b border-ws-line">
        {data.trend.map((point, index) => <button key={point.date} type="button"
          aria-label={`${displayDate(point.date, data.period === "YEAR" ? { day: undefined, month: "long" } : undefined)}: ${formatMoney(point.amount, data.currency)}, ${point.paymentCount} payments`}
          aria-pressed={active === index} onClick={() => setActive(index)} onFocus={() => setActive(index)}
          className="group flex min-w-0 flex-1 flex-col justify-end rounded-t-sm outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <span className={cn("mx-auto w-full max-w-12 rounded-t-sm bg-primary/70 transition-colors group-hover:bg-primary", active === index && "bg-primary")}
            style={{ height: point.amount > 0 ? `${Math.max(point.amount / max * 100, 2)}%` : "0%" }} />
        </button>)}
      </div>
      <div className="mt-2 flex min-w-[460px] gap-1.5 text-center text-[10px] text-ws-faint" aria-hidden="true">
        {data.trend.map((point, index) => <span key={point.date} className="min-w-0 flex-1">
          {data.period === "YEAR" ? displayDate(point.date, { day: undefined, year: undefined })
            : data.period === "WEEK" ? displayDate(point.date, { year: undefined, month: undefined, weekday: "short", day: undefined })
            : index % 5 === 0 || index === data.trend.length - 1 ? Number(point.date.slice(-2)) : ""}
        </span>)}
      </div>
    </div>
  </section>;
}
