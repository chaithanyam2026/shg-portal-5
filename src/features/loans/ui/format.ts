/**
 * Formats a currency value.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a number.
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

/**
 * Formats a date.
 */
export function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("en-IN");
}

/**
 * Formats percentage.
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}
