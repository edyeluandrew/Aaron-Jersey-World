import Button from '@/components/common/Button';

export default function RequestSuccess({
  title = 'Request submitted',
  referenceNumber,
  description = 'Thank you. Our team will review your request and contact you soon.',
  onReset,
}) {
  return (
    <div className="rounded-card border border-green-200 bg-green-50 p-8 text-center">
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-success">Success</p>
      <h2 className="mb-3">{title}</h2>
      {referenceNumber && (
        <p className="mb-4 text-lg">
          Reference: <span className="font-bold text-brand-black">{referenceNumber}</span>
        </p>
      )}
      <p className="mx-auto mb-6 max-w-md text-text-muted">{description}</p>
      {onReset && (
        <Button variant="secondary" onClick={onReset}>
          Submit another request
        </Button>
      )}
    </div>
  );
}
