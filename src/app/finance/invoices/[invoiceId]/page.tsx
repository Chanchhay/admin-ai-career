"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Printer, Send, X } from "lucide-react";
import { toast } from "sonner";
import { InvoiceStatusChip } from "@/components/console/InvoiceStatusChip";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Panel, PanelHeader } from "@/components/workspace/primitives";
import type { InvoiceResponse } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDate, formatDateTime, humanizeEnum, orDash } from "@/lib/format";
import { formatMoney } from "@/lib/money";
import { isUuid } from "@/lib/uuid";
import {
  useCancelInvoiceMutation,
  useGetInvoiceQuery,
  useIssueInvoiceMutation,
  useRecordPaymentMutation,
} from "@/services/financeApi";

/**
 * One invoice, as a document.
 *
 * The sheet below is the invoice itself — issuer, bill-to, line items, totals —
 * and it is what prints. Everything that acts on it is interface, marked
 * `print-hide`, so a printed copy is a bill rather than a screenshot of an
 * admin tool.
 */
export default function InvoiceDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();

  const { data: invoice, isLoading, isError, refetch } = useGetInvoiceQuery(
    invoiceId,
    { skip: !isUuid(invoiceId) },
  );

  useSetPageHeading(invoice?.invoiceNo ?? "Invoice");

  if (isLoading) return <LoadingState rows={6} />;
  if (isError || !invoice) {
    return <ErrorState message="Unable to load this invoice." onRetry={refetch} />;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="print-hide flex flex-wrap items-center gap-3">
        <Link
          href="/finance"
          aria-label="Back to finance"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-ws-faint transition-colors hover:bg-ws-card hover:text-ws-fg"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </Link>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-semibold tracking-tight text-ws-fg">
            {invoice.invoiceNo}
          </h2>
          <p className="truncate text-sm text-ws-faint">
            {orDash(invoice.companyName)}
          </p>
        </div>

        <InvoiceStatusChip status={invoice.status} />

        <Button variant="outline" onClick={() => window.print()}>
          <Printer aria-hidden="true" /> Print
        </Button>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <InvoiceSheet invoice={invoice} />

        <aside className="print-hide flex flex-col gap-4">
          <InvoiceActions invoice={invoice} />
          <PaymentsPanel invoice={invoice} />
        </aside>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- sheet --- */

function InvoiceSheet({ invoice }: { invoice: InvoiceResponse }) {
  const paid = invoice.paidAmount > 0;

  return (
    <article className="print-sheet rounded-xl border border-ws-line bg-ws-panel p-6 sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <BrandLogo height={28} />
          <p className="mt-2 text-xs leading-5 text-ws-muted">
            Kagea · AI Career Platform
            <br />
            Phnom Penh, Cambodia
          </p>
        </div>

        <div className="text-right">
          <h1 className="text-2xl font-semibold tracking-tight text-ws-fg">
            Invoice
          </h1>
          <p className="mt-1 font-medium tabular-nums text-ws-fg">
            {invoice.invoiceNo}
          </p>
          <p className="mt-1 text-xs text-ws-muted">
            {humanizeEnum(invoice.status)}
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-4 border-t border-ws-line pt-5 sm:grid-cols-2">
        <div>
          <p className="text-xs text-ws-faint">Billed to</p>
          <p className="mt-1 font-medium text-ws-fg">
            {orDash(invoice.companyName)}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:justify-self-end">
          <dt className="text-ws-faint">Issued</dt>
          <dd className="text-right tabular-nums text-ws-fg">
            {invoice.issuedAt ? formatDate(invoice.issuedAt) : "Not issued"}
          </dd>
          <dt className="text-ws-faint">Due</dt>
          <dd className="text-right tabular-nums text-ws-fg">
            {invoice.dueAt ? formatDate(invoice.dueAt) : "—"}
          </dd>
          {invoice.paidAt ? (
            <>
              <dt className="text-ws-faint">Paid</dt>
              <dd className="text-right tabular-nums text-ws-fg">
                {formatDate(invoice.paidAt)}
              </dd>
            </>
          ) : null}
        </dl>
      </div>

      <table className="mt-6 w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-ws-line">
            <th scope="col" className="py-2 text-xs font-semibold text-ws-muted">
              Description
            </th>
            <th
              scope="col"
              className="w-20 py-2 text-right text-xs font-semibold text-ws-muted"
            >
              Qty
            </th>
            <th
              scope="col"
              className="w-32 py-2 text-right text-xs font-semibold text-ws-muted"
            >
              Unit
            </th>
            <th
              scope="col"
              className="w-32 py-2 text-right text-xs font-semibold text-ws-muted"
            >
              Amount
            </th>
          </tr>
        </thead>

        <tbody>
          {invoice.items.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-6 text-center text-sm text-ws-faint">
                This invoice has no lines.
              </td>
            </tr>
          ) : (
            invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-ws-line/70">
                <td className="py-2.5 text-sm text-ws-fg">{item.description}</td>
                <td className="py-2.5 text-right text-sm tabular-nums text-ws-muted">
                  {item.quantity}
                </td>
                <td className="py-2.5 text-right text-sm tabular-nums text-ws-muted">
                  {formatMoney(item.unitAmount, invoice.currency)}
                </td>
                <td className="py-2.5 text-right text-sm tabular-nums text-ws-fg">
                  {formatMoney(item.totalAmount, invoice.currency)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-5 flex justify-end">
        <dl className="w-full max-w-xs text-sm">
          <Total label="Subtotal" value={formatMoney(invoice.subtotalAmount, invoice.currency)} />
          <Total label="Tax" value={formatMoney(invoice.taxAmount, invoice.currency)} />
          <Total
            label="Total"
            value={formatMoney(invoice.totalAmount, invoice.currency)}
            strong
          />
          {paid ? (
            <Total label="Paid" value={`− ${formatMoney(invoice.paidAmount, invoice.currency)}`} />
          ) : null}
          <Total
            label="Outstanding"
            value={formatMoney(invoice.outstandingAmount, invoice.currency)}
            strong
          />
        </dl>
      </div>

      {invoice.note ? (
        <p className="mt-6 border-t border-ws-line pt-4 text-sm leading-6 text-ws-muted">
          {invoice.note}
        </p>
      ) : null}

      <p className="mt-6 text-xs text-ws-faint">
        Commission on placements made through the platform. Questions about this
        invoice go to the moderator who issued it.
      </p>
    </article>
  );
}

function Total({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-ws-line/70 py-1.5 last:border-0">
      <dt className={strong ? "font-medium text-ws-fg" : "text-ws-muted"}>
        {label}
      </dt>
      <dd
        className={
          strong
            ? "font-semibold tabular-nums text-ws-fg"
            : "tabular-nums text-ws-muted"
        }
      >
        {value}
      </dd>
    </div>
  );
}

/* ------------------------------------------------------------- actions --- */

function InvoiceActions({ invoice }: { invoice: InvoiceResponse }) {
  const [issueInvoice, issueState] = useIssueInvoiceMutation();
  const [cancelInvoice, cancelState] = useCancelInvoiceMutation();
  const busy = issueState.isLoading || cancelState.isLoading;

  const draft = invoice.status === "DRAFT";
  const settled = invoice.status === "PAID" || invoice.status === "CANCELLED";

  async function run(action: "issue" | "cancel") {
    try {
      if (action === "issue") {
        await issueInvoice(invoice.id).unwrap();
        toast.success("Invoice issued.");
      } else {
        await cancelInvoice(invoice.id).unwrap();
        toast.success("Invoice cancelled.");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update this invoice."));
    }
  }

  return (
    <Panel variant="outlined">
      <PanelHeader title="Status" />

      <p className="text-sm leading-6 text-ws-muted">
        {draft
          ? "A draft is private. Issuing it is what the recruiter sees, and starts the payment clock."
          : invoice.status === "ISSUED"
            ? "Issued and awaiting payment."
            : invoice.status === "PAID"
              ? "Settled in full."
              : "Cancelled. Its commissions returned to the unbilled pool."}
      </p>

      {settled ? null : (
        <div className="mt-3 flex flex-wrap gap-2">
          {draft ? (
            <Button size="sm" disabled={busy} onClick={() => void run("issue")}>
              <Send aria-hidden="true" /> Issue invoice
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="destructive"
            disabled={busy}
            onClick={() => void run("cancel")}
          >
            <X aria-hidden="true" /> Cancel
          </Button>
        </div>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------ payments --- */

function PaymentsPanel({ invoice }: { invoice: InvoiceResponse }) {
  const [recordPayment, { isLoading }] = useRecordPaymentMutation();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  const payments = invoice.payments ?? [];
  const open = invoice.status === "ISSUED" && invoice.outstandingAmount > 0;

  async function submit() {
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Enter the amount received.");
      return;
    }

    try {
      await recordPayment({
        invoiceId: invoice.id,
        body: {
          amount: value,
          paymentMethod: method.trim() || undefined,
          transactionReference: reference.trim() || undefined,
          note: note.trim() || undefined,
        },
      }).unwrap();
      toast.success("Payment recorded.");
      setAmount("");
      setMethod("");
      setReference("");
      setNote("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to record the payment."));
    }
  }

  return (
    <Panel variant="outlined">
      <PanelHeader title={`Payments (${payments.length})`} />

      {payments.length === 0 ? (
        <p className="text-sm text-ws-faint">Nothing received yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {payments.map((payment) => (
            <li
              key={payment.id}
              className="rounded-lg bg-ws-card px-3 py-2 text-sm"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium tabular-nums text-ws-fg">
                  {formatMoney(payment.amount, payment.currency)}
                </span>
                <span className="text-xs text-ws-faint">
                  {payment.paidAt ? formatDateTime(payment.paidAt) : "—"}
                </span>
              </div>
              <p className="text-xs text-ws-faint">
                {[payment.paymentMethod, payment.transactionReference]
                  .filter(Boolean)
                  .join(" · ") || humanizeEnum(payment.status)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {open ? (
        <div className="mt-3 flex flex-col gap-2 border-t border-ws-line pt-3">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted">
            Amount received ({invoice.currency})
            <Input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder={String(invoice.outstandingAmount)}
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted">
              Method
              <Input
                value={method}
                onChange={(event) => setMethod(event.target.value)}
                placeholder="Bank transfer"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted">
              Reference
              <Input
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="TXN-0001"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted">
            Note
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={2}
            />
          </label>

          <div>
            <Button size="sm" disabled={isLoading} onClick={() => void submit()}>
              {isLoading ? "Recording…" : "Record payment"}
            </Button>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
