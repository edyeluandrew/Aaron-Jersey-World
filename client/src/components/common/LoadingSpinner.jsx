export default function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8" role="status" aria-live="polite">
      <span
        className={`animate-spin rounded-full border-2 border-brand-red border-t-transparent ${sizes[size]}`}
        aria-hidden="true"
      />
      <span className="text-sm text-text-muted">{label}</span>
    </div>
  );
}
