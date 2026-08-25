"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Ban, ReceiptText, Send, Wallet } from "lucide-react";
import { toast } from "sonner";
import { InvoiceStatusChip } from "@/components/console/InvoiceStatusChip";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GhostChip, Panel, PanelHeader } from "@/components/workspace/primitives";
import type { InvoiceResponse } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDate } from "@/lib/format";
import { formatMoney } from "@/lib/money";
import {
  useCancelInvoiceMutation,
  useGetInvoiceQuery,
  useIssueInvoiceMutation,
  useRecordPaymentMutation,
} from "@/services/financeApi";

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  useSetPageHeading("Invoice");

  const { data, isLoading, isError, refetch } = useGetInvoiceQuery(
    Number(invoiceId),
  );

  if (isLoading) return <LoadingState rows={6} />;
  if (isError || !data) {
    return <ErrorState message="Unable to load this invoice." onRetry={refetch} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/finance"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ws-muted transition-colors hover:text-ws-fg"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> All invoices
      </Link>

      <Panel>
        <PanelHeader
          title={data.invoiceNo}
          icon={<ReceiptText aria-hidden="true" className="size-5" />}
          action={<InvoiceStatusChip status={data.status} />}
        />

        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <GhostChip>{data.companyName}</GhostChip>
          <GhostChip>Issued {formatDate(data.issuedAt)}</GhostChip>
          <GhostChip>Due {formatDate(data.dueAt)}</GhostChip>
        </div>

        <ul className="flex flex-col gap-2">
          {data.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-[18px] bg-ws-card-hover px-4 py-3"
            >
              <span className="min-w-0 flex-1 truncate text-sm text-ws-fg">
                {item.description}
              </span>
              <span className="text-sm font-semibold text-ws-fg">
                {formatMoney(item.totalAmount, data.currency)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-1.5 text-sm">
          <Row label="Subtotal" value={formatMoney(data.subtotalAmount, data.currency)} />
          <Row label="Tax" value={formatMoney(data.taxAmount, data.currency)} />
          <Row label="Total" value={formatMoney(data.totalAmount, data.currency)} strong />
          <Row label="Paid" value={formatMoney(data.paidAmount, data.currency)} />
          <Row
            label="Outstanding"
            value={formatMoney(data.outstandingAmount, data.currency)}
            strong
          />
        </dl>

        <InvoiceActions invoice={data} />
      </Panel>

      {data.status !== "DRAFT" && data.status !== "CANCELLED" ? (
        <PaymentsPanel invoice={data} />
      ) : null}
    </div>
  );
}

function InvoiceActions({ invoice }: { invoice: InvoiceResponse }) {
  const [issueInvoice, issueState] = useIssueInvoiceMutation();
  const [cancelInvoice, cancelState] = useCancelInvoiceMutation();

  const pending = issueState.isLoading || cancelState.isLoading;

  async function run(action: "issue" | "cancel") {
    try {
      if (action === "issue") {
        await issueInvoice(invoice.id).unwrap();
        toast.success("Invoice issued. The recruiter has been notified.");
      } else {
        await cancelInvoice(invoice.id).unwrap();
        toast.success("Invoice cancelled. Its commissions are billable again.");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update the invoice."));
    }
  }

  // Nothing to do on a finished invoice; the buttons disappear rather than
  // sitting there disabled with no explanation.
  if (invoice.status === "PAID" || invoice.status === "CANCELLED") return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {invoice.status === "DRAFT" ? (
        <Button disabled={pending} onClick={() => void run("issue")}>
          <Send aria-hidden="true" /> {issueState.isLoading ? "Issuing…" : "Issue invoice"}
        </Button>
      ) : null}

      {invoice.paidAmount === 0 ? (
        <Button
          variant="destructive"
          disabled={pending}
          onClick={() => void run("cancel")}
        >
          <Ban aria-hidden="true" /> Cancel
        </Button>
      ) : null}
    </div>
  );
}

function PaymentsPanel({ invoice }: { invoice: InvoiceResponse }) {
  const [recordPayment, { isLoading }] = useRecordPaymentMutation();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

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
    <Panel>
      <PanelHeader
        title="Payments"
        icon={<Wallet aria-hidden="true" className="size-5" />}
      />

      {invoice.payments && invoice.payments.length > 0 ? (
        <ul className="mb-4 flex flex-col gap-2">
          {invoice.payments.map((payment) => (
            <li
              key={payment.id}
              className="flex items-center justify-between gap-4 rounded-[18px] bg-ws-card-hover px-4 py-3 text-sm"
            >
              <span className="text-ws-muted">
                {formatDate(payment.paidAt)}
                {payment.paymentMethod ? ` · ${payment.paymentMethod}` : ""}
                {payment.transactionReference
                  ? ` · ${payment.transactionReference}`
                  : ""}
              </span>
              <span className="font-semibold text-ws-fg">
                {formatMoney(payment.amount, payment.currency)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-sm text-ws-faint">Nothing received yet.</p>
      )}

      {/*
        * Payments are entered by hand because nothing on this platform takes
        * money — every row records something that happened in a bank.
        */}
      {invoice.status === "PAID" ? null : (
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ws-muted">
                Amount ({invoice.currency})
              </span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ws-muted">Method</span>
              <Input
                value={method}
                onChange={(event) => setMethod(event.target.value)}
                placeholder="Bank transfer"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ws-muted">
                Reference
              </span>
              <Input
                value={reference}
                onChange={(event) => setReference(event.target.value)}
              />
            </label>
          </div>

          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Note (optional)"
            rows={2}
            maxLength={2000}
          />

          <div>
            <Button disabled={isLoading} onClick={() => void submit()}>
              {isLoading ? "Recording…" : "Record payment"}
            </Button>
          </div>
        </div>
      )}
    </Panel>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-ws-muted">{label}</dt>
      <dd className={strong ? "font-semibold text-ws-fg" : "text-ws-fg"}>
        {value}
      </dd>
    </div>
  );
}
