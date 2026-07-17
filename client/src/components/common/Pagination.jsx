import Button from './Button';

export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <nav
      className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row"
      aria-label="Pagination"
    >
      <p className="text-sm text-text-muted">
        Showing page {meta.page} of {meta.totalPages} ({meta.total} results)
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!meta.hasPrevPage}
          onClick={() => onPageChange(meta.page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
