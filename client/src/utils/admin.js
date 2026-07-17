export function formatAdminDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-UG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatLabel(value) {
  if (!value) return '—';
  return String(value).replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getRequestStatusVariant(status) {
  switch (status) {
    case 'NEW':
      return 'warning';
    case 'CONTACTED':
    case 'IN_REVIEW':
      return 'default';
    case 'QUOTED':
    case 'CONFIRMED':
      return 'gold';
    case 'COMPLETED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    case 'ARCHIVED':
      return 'dark';
    default:
      return 'default';
  }
}
