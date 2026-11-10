const dateFormatter = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const shortDateFormatter = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const relativeFormatter = new Intl.RelativeTimeFormat('es-CL', { numeric: 'auto' });

export function formatDateTime(iso: string | null): string {
  if (!iso) return 'Sin registro';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Sin registro';
  return dateFormatter.format(date);
}

export function formatDate(iso: string | null): string {
  if (!iso) return 'Sin fecha registrada';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Sin fecha registrada';
  return shortDateFormatter.format(date);
}

export function formatRelative(iso: string | null): string {
  if (!iso) return 'Sin registro';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Sin registro';

  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const absoluteMinutes = Math.abs(diffMinutes);

  if (absoluteMinutes < 1) return 'hace un momento';
  if (absoluteMinutes < 60) return relativeFormatter.format(diffMinutes, 'minute');

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return relativeFormatter.format(diffHours, 'hour');

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 30) return relativeFormatter.format(diffDays, 'day');

  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) return relativeFormatter.format(diffMonths, 'month');

  return formatDate(iso);
}

export function formatRating(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}
