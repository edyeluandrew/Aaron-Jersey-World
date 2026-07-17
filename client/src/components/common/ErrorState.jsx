import { AlertCircle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this content. Please try again.',
  onRetry,
}) {
  return (
    <div className="rounded-card border border-red-200 bg-red-50 px-6 py-12 text-center">
      <AlertCircle className="mx-auto mb-4 h-10 w-10 text-error" aria-hidden="true" />
      <h3 className="mb-2 text-xl font-semibold text-brand-black">{title}</h3>
      <p className="mx-auto mb-6 max-w-md text-text-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
