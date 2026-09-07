"use client";

import Link from "next/link";
import { useState } from "react";
import { HandCoins, TriangleAlert } from "lucide-react";
import { BillCompanyPanel } from "@/components/finance/BillCompanyPanel";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import {
  GhostChip,
  Panel,
  PanelHeader,
} from "@/components/workspace/primitives";
import { formatDate } from "@/lib/format";
import { formatMoney } from "@/lib/money";
import { useGetBillableCompaniesQuery } from "@/services/financeApi";

/**
 * Who there is to bill, and the way in to billing them.
 *
 * <p>Invoicing lives on the company page because an invoice needs a company,
 * but that made it unfindable: finance opens the finance desk, sees a list of
 * invoices, and has no way to create one. This panel closes that — it names the
 * companies holding unbilled commissions and opens the existing
 * {@link BillCompanyPanel} against whichever one is picked, so there is exactly
 * one billing form rather than two that can drift apart.
 */
export function ReadyToBillPanel({ bare = false }: { bare?: boolean } = {}) {
  const { data, isLoading, isError, refetch } = useGetBillableCompaniesQuery();
  const [selected, setSelected] = useState<string | null>(null);

  if (isLoading) return <LoadingState rows={3} />;

  if (isError) {
    const error = (
      <ErrorState
        message="Unable to load billable companies."
        onRetry={refetch}
      />
    );

    return bare ? (
      error
    ) : (
      <Panel variant="outlined">
        <PanelHeader
          title="Ready to bill"
          icon={<HandCoins aria-hidden="true" className="size-4" />}
        />
        {error}
      </Panel>
    );
  }

  const companies = data ?? [];

  // A company can leave the pool while its form is open — billing it is exactly
  // what removes it. Dropping the selection avoids leaving an empty form up.
  const openCompany =
    selected != null &&
    companies.some((company) => company.companyId === selected)
      ? selected
      : null;

  const body = (
    <>
      {companies.length === 0 ? (
        <p className="rounded-xl bg-ws-card px-4 py-6 text-center text-sm text-ws-faint">
          {/* The hires table is on this page now, so there is nowhere to
                send the reader — the queue is a few centimetres up. */}
          Nothing to bill. A commission appears here once a reported hire is
          confirmed.
        </p>
      ) : (
        <>
          <p className="mb-4 text-sm text-ws-muted">
            Commissions from confirmed hires that no invoice has picked up yet.
            Pick a company to draft its bill.
          </p>

          <ul className="flex flex-col gap-2">
            {companies.map((company) => {
              const overdue = isPast(company.oldestDueAt);
              const isOpen = openCompany === company.companyId;

              return (
                <li
                  key={`${company.companyId}-${company.currency}`}
                  className="flex flex-wrap items-center gap-3 rounded-xl bg-ws-card-hover px-3 py-2"
                >
                  <span className="min-w-0 flex-1">
                    <Link
                      href={`/companies/${company.companyId}`}
                      className="block truncate text-sm font-semibold text-ws-fg hover:underline"
                    >
                      {company.companyName}
                    </Link>
                    <span className="block truncate text-xs text-ws-faint">
                      {company.commissionCount}{" "}
                      {company.commissionCount === 1
                        ? "commission"
                        : "commissions"}{" "}
                      · oldest due {formatDate(company.oldestDueAt)}
                    </span>
                  </span>

                  {overdue ? (
                    <GhostChip>
                      <TriangleAlert aria-hidden="true" className="size-3.5" />{" "}
                      Overdue
                    </GhostChip>
                  ) : null}

                  <GhostChip>
                    {formatMoney(company.totalAmount, company.currency)}
                  </GhostChip>

                  <Button
                    variant={isOpen ? "outline" : "default"}
                    className="h-9 rounded-lg px-4"
                    onClick={() =>
                      setSelected(isOpen ? null : company.companyId)
                    }
                  >
                    {isOpen ? "Close" : "Bill"}
                  </Button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {openCompany != null ? (
        <BillCompanyPanel companyId={openCompany} />
      ) : null}
    </>
  );

  // Inside a dialog the surface and the title come from the dialog itself, so
  // wrapping the same content in a panel would draw a card inside a card.
  if (bare) return body;

  return (
    <Panel variant="outlined">
      <PanelHeader
        title={
          companies.length > 0
            ? `Ready to bill (${companies.length})`
            : "Ready to bill"
        }
        icon={<HandCoins aria-hidden="true" className="size-4" />}
      />
      {body}
    </Panel>
  );
}

/**
 * Whether a due date has already passed.
 *
 * Kept out of the component body: reading the clock during render is not
 * idempotent, and the answer only decides whether a chip is drawn — it does not
 * need to stay live between renders.
 */
function isPast(value: string | null): boolean {
  if (!value) return false;
  const due = new Date(value).getTime();
  return !Number.isNaN(due) && due < Date.now();
}
