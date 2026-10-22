const formatters = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string, fractionDigits: 0 | 2) {
  const key = `${currency}:${fractionDigits}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    formatters.set(key, formatter);
  }
  return formatter;
}

/**
 * Prices are stored as integer minor units (cents) and only formatted for display.
 * Whole amounts drop the decimals ("$4,890"); fractional ones show both ("$12.50").
 */
export function formatPrice(cents: number, currency = "USD"): string {
  const isWhole = cents % 100 === 0;
  return getFormatter(currency, isWhole ? 0 : 2).format(cents / 100);
}
