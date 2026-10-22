const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Prices are stored as integer minor units (cents) and only formatted for display. */
export function formatPrice(cents: number): string {
  return currencyFormatter.format(cents / 100);
}
