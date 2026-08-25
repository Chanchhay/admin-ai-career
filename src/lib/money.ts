/** Currency formatting shared by the hire and invoice screens. */
export function formatMoney(
  amount: number | null | undefined,
  currency: string | null | undefined,
) {
  if (amount == null) return "Not specified";

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}
