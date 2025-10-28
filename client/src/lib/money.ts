/**
 * Formats a number as euros with Spanish locale
 */
export function formatEuros(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a number with Spanish locale (for hours, rates, etc.)
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Rounds to 2 decimal places
 */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Converts minutes to hours with decimals
 */
export function minutesToHours(minutes: number): number {
  return round2(minutes / 60);
}

/**
 * Formats minutes as hours string
 */
export function formatMinutesAsHours(minutes: number): string {
  return formatNumber(minutesToHours(minutes));
}
