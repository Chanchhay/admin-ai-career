"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Receipt } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GhostChip, Panel, PanelHeader } from "@/components/workspace/primitives";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDate } from "@/lib/format";
import { formatMoney } from "@/lib/money";
import {
  useCreateInvoiceMutation,
  useGetUnbilledCommissionsQuery,
} from "@/services/financeApi";

/**
 * Bills a company for the commissions no invoice has picked up yet.
 *
 * <p>Selection is deliberate rather than "invoice everything": a disputed hire
 * should be leavable off this month's bill without anything special happening
 * to it — it simply stays in the pool.
 *
 * <p>Renders nothing when the pool is empty, so the panel only appears on a
 * company that actually owes something.
 */
export function BillCompanyPanel({ companyId }: { companyId: string }) {
  const router = useRouter();
  const { data: commissions, isLoading } =
    useGetUnbilledCommissionsQuery(companyId);
  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();

  const [selected, setSelected] = useState<string[] | null>(null);
  const [tax, setTax] = useState("0");

  if (isLoading || !commissions || commissions.length === 0) return null;

  // Default to billing everything; unticking is the exception.
  const chosen = selected ?? commissions.map((commission) => commission.id);
  const currency = commissions[0].currency;

  const subtotal = commissions
    .filter((commission) => chosen.includes(commission.id))
    .reduce((sum, commission) => sum + commission.commissionAmount, 0);

  const taxValue = Number(tax) || 0;

  const toggle = (id: string) =>
    setSelected(
      chosen.includes(id)
        ? chosen.filter((item) => item !== id)
        : [...chosen, id],
    );

  async function submit() {
    if (chosen.length === 0) {
      toast.error("Pick at least one commission to bill.");
      return;
    }

    try {
      const invoice = await createInvoice({
        companyId,
        commissionRecordIds: chosen,
        taxAmount: taxValue,
      }).unwrap();

      toast.success(`Draft ${invoice.invoiceNo} created.`);
      router.push(`/finance/invoices/${invoice.id}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to create the invoice."));
    }
  }

  return (
    <Panel>
      <PanelHeader
        title={`Unbilled commissions (${commissions.length})`}
        icon={<Receipt aria-hidden="true" className="size-4" />}
      />

      <p className="mb-4 text-sm text-ws-muted">
        Creates a draft invoice. Nothing reaches the recruiter until you issue
        it.
      </p>

      <ul className="flex flex-col gap-2">
        {commissions.map((commission) => (
          <li key={commission.id}>
            <label className="flex items-center gap-3 rounded-xl bg-ws-card-hover px-4 py-3">
              <input
                type="checkbox"
                checked={chosen.includes(commission.id)}
                onChange={() => toggle(commission.id)}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-ws-fg">
                  Placement commission at {commission.commissionRate}%
                </span>
                <span className="block text-xs text-ws-faint">
                  Due {formatDate(commission.dueAt)}
                </span>
              </span>
              <GhostChip>
                {formatMoney(commission.commissionAmount, commission.currency)}
              </GhostChip>
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ws-muted">
            Tax ({currency})
          </span>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={tax}
            onChange={(event) => setTax(event.target.value)}
            className="w-32"
          />
        </label>

        <div className="text-sm">
          <p className="text-ws-muted">
            Subtotal {formatMoney(subtotal, currency)}
          </p>
          <p className="font-semibold text-ws-fg">
            Total {formatMoney(subtotal + taxValue, currency)}
          </p>
        </div>

        <Button
          className="ml-auto"
          disabled={isCreating || chosen.length === 0}
          onClick={() => void submit()}
        >
          {isCreating ? "Creating…" : "Create draft invoice"}
        </Button>
      </div>
    </Panel>
  );
}
