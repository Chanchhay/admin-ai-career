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
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
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
  const tx = useWorkspaceTranslation();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  useSetPageHeading(tx("Invoice"));

  const { data, isLoading, isError, refetch } = useGetInvoiceQuery(
    Number(invoiceId),
  );

  if (isLoading) return <LoadingState rows={6} />;
  if (isError || !data) {
    return (
      <ErrorState
        message={tx("Unable to load this invoice.")}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/finance"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ws-muted transition-colors hover:text-ws-fg"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> {tx("All invoices")}
      </Link>

      <Panel>
        <PanelHeader
          title={data.invoiceNo}
          icon={<ReceiptText aria-hidden="true" className="size-5" />}
          action={<InvoiceStatusChip status={data.status} />}
        />

        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <GhostChip>{data.companyName}</GhostChip>
          <GhostChip>
            {tx("Issued {date}", { date: formatDate(data.issuedAt) })}
          </GhostChip>
          <GhostChip>
            {tx("Due {date}", { date: formatDate(data.dueAt) })}
          </GhostChip>
        </div>

        <ul className="flex flex-col gap-2">
          {data.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 max-lg:flex-wrap rounded-[18px] bg-ws-card-hover px-4 py-3"
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
          <Row
            label={tx("Subtotal")}
            value={formatMoney(data.subtotalAmount, data.currency)}
          />
          <Row label={tx("Tax")} value={formatMoney(data.taxAmount, data.currency)} />
          <Row
            label={tx("Total")}
            value={formatMoney(data.totalAmount, data.currency)}
            strong
          />
          <Row label={tx("Paid")} value={formatMoney(data.paidAmount, data.currency)} />
          <Row
            label={tx("Outstanding")}
            value={formatMoney(data.outstandingAmount, data.currency)}
            strong
          />
        </dl>

        <InvoiceActions invoice={data} />
      </Panel>

      {/*
        * A draft owes nothing, so there is nothing to pay against it yet — but
        * saying so beats the panel simply not being there, which reads as a
        * missing feature.
        */}
      {data.status === "DRAFT" ? (
        <Panel>
          <PanelHeader
            title="Payments"
            icon={<Wallet aria-hidden="true" className="size-5" />}
          />
          <p className="text-sm text-ws-faint">
            {tx("Issue this invoice to record payments against it.")}
          </p>
        </Panel>
      ) : data.status !== "CANCELLED" ? (
        <PaymentsPanel invoice={data} />
      ) : null}
    </div>
  );
}

function InvoiceActions({ invoice }: { invoice: InvoiceResponse }) {
  const tx = useWorkspaceTranslation();
  const [issueInvoice, issueState] = useIssueInvoiceMutation();
  const [cancelInvoice, cancelState] = useCancelInvoiceMutation();

  const pending = issueState.isLoading || cancelState.isLoading;

  async function run(action: "issue" | "cancel") {
    try {
      if (action === "issue") {
        await issueInvoice(invoice.id).unwrap();
        toast.success(tx("Invoice issued. The recruiter has been notified."));
      } else {
        await cancelInvoice(invoice.id).unwrap();
        toast.success(
          tx("Invoice cancelled. Its commissions are billable again."),
        );
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, tx("Unable to update the invoice.")));
    }
  }

  // Nothing to do on a finished invoice; the buttons disappear rather than
  // sitting there disabled with no explanation.
  if (invoice.status === "PAID" || invoice.status === "CANCELLED") return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {invoice.status === "DRAFT" ? (
        <Button disabled={pending} onClick={() => void run("issue")}>
          <Send aria-hidden="true" />{" "}
          {issueState.isLoading ? tx("Issuing…") : tx("Issue invoice")}
        </Button>
      ) : null}

      {invoice.paidAmount === 0 ? (
        <Button
          variant="destructive"
          disabled={pending}
          onClick={() => void run("cancel")}
        >
          <Ban aria-hidden="true" /> {tx("Cancel")}
        </Button>
      ) : null}
    </div>
  );
}

function PaymentsPanel({ invoice }: { invoice: InvoiceResponse }) {
  const tx = useWorkspaceTranslation();
  const [recordPayment, { isLoading }] = useRecordPaymentMutation();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  async function submit() {
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      toast.error(tx("Enter the amount received."));
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

      toast.success(tx("Payment recorded."));
      setAmount("");
      setMethod("");
      setReference("");
      setNote("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, tx("Unable to record the payment.")));
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
              className="flex items-center justify-between gap-4 max-lg:flex-wrap rounded-[18px] bg-ws-card-hover px-4 py-3 text-sm"
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
        <p className="mb-4 text-sm text-ws-faint">
          {tx("Nothing received yet.")}
        </p>
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
                {tx("Amount ({currency})", { currency: invoice.currency })}
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
              <span className="text-xs font-semibold text-ws-muted">
                {tx("Method")}
              </span>
              <Input
                value={method}
                onChange={(event) => setMethod(event.target.value)}
                placeholder={tx("Bank transfer")}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ws-muted">
                {tx("Reference")}
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
            placeholder={tx("Note (optional)")}
            rows={2}
            maxLength={2000}
          />

          <div>
            <Button disabled={isLoading} onClick={() => void submit()}>
              {isLoading ? tx("Recording…") : tx("Record payment")}
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
