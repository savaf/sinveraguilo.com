// "2025-11" (+ optional end, else "now") -> months elapsed, inclusive of both endpoint months
export function monthsBetween(start: string, end?: string | null): number {
  const [sy, sm] = start.split("-").map(Number);
  const now = new Date();
  const [ey, em] = end ? end.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];
  return Math.max(1, (ey - sy) * 12 + (em - sm) + 1);
}

// "2025-11" -> "Nov 2025" / "nov 2025", localized via Intl
export function formatMonth(value: string, locale: string): string {
  const [y, m] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(new Date(y, m - 1, 1));
}
