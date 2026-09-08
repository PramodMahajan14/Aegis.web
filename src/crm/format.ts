/* Display formatting helpers for the CRM UI. */

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]!.toUpperCase())
    .join('');
}

const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

/** "2h ago", "in 3 days", "just now" */
export function relativeTime(iso: string): string {
  if (!iso) return '';
  const diffMs = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const min = 60_000;
  const hr = 60 * min;
  const day = 24 * hr;
  if (abs < 45 * 1000) return 'just now';
  if (abs < hr) return rtf.format(Math.round(diffMs / min), 'minute');
  if (abs < day) return rtf.format(Math.round(diffMs / hr), 'hour');
  if (abs < 30 * day) return rtf.format(Math.round(diffMs / day), 'day');
  if (abs < 365 * day) return rtf.format(Math.round(diffMs / (30 * day)), 'month');
  return rtf.format(Math.round(diffMs / (365 * day)), 'year');
}

export function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** For <input type="datetime-local"> / <input type="date"> value binding. */
export function toInputDate(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toISOString().slice(0, 10);
}
export function toInputDateTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}
export function fromInput(value: string): string {
  if (!value) return '';
  return new Date(value).toISOString();
}

export function formatMoney(n?: number): string {
  if (n == null) return '—';
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

export function formatBytes(n?: number): string {
  if (!n) return '';
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} MB`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)} KB`;
  return `${n} B`;
}

export function isOverdue(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

export function isToday(iso: string): boolean {
  const d = new Date(iso);
  const t = new Date();
  return d.toDateString() === t.toDateString();
}
