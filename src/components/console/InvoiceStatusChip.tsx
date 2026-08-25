import { Chip, type Tone } from "@/components/workspace/primitives";
import type { HiringRecordStatus, InvoiceStatus } from "@/contracts";
import { humanizeEnum } from "@/lib/format";

/**
 * Money statuses, toned like the rest of the console: `solid` is settled,
 * `alert` is a refusal or a problem, `soft` is still in motion, `quiet` is
 * not yet real.
 */
const invoiceTone: Record<InvoiceStatus, Tone> = {
  DRAFT: "quiet",
  ISSUED: "soft",
  PARTIALLY_PAID: "soft",
  PAID: "solid",
  OVERDUE: "alert",
  CANCELLED: "alert",
};

const hiringTone: Record<HiringRecordStatus, Tone> = {
  REPORTED: "soft",
  CONFIRMED: "solid",
  REJECTED: "alert",
};

export function InvoiceStatusChip({ status }: { status: InvoiceStatus }) {
  return <Chip tone={invoiceTone[status]}>{humanizeEnum(status)}</Chip>;
}

export function HiringStatusChip({ status }: { status: HiringRecordStatus }) {
  return <Chip tone={hiringTone[status]}>{humanizeEnum(status)}</Chip>;
}
