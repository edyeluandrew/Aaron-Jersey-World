import Button from './Button';

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Check back soon or try adjusting your filters.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="rounded-card border border-dashed border-border-light bg-white px-6 py-16 text-center">
      <h3 className="mb-2 text-xl font-semibold text-brand-black">{title}</h3>
      <p className="mx-auto mb-6 max-w-md text-text-muted">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
