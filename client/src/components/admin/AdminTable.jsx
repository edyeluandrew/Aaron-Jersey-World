import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorState from '@/components/common/ErrorState';

export default function AdminTable({ columns, rows, isLoading, isError, onRetry, emptyMessage = 'No records found' }) {
  if (isLoading) return <LoadingSpinner label="Loading records..." />;
  if (isError) return <ErrorState onRetry={onRetry} />;

  if (!rows.length) {
    return (
      <div className="rounded-card border border-border-light bg-white p-8 text-center text-text-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-border-light bg-white shadow-card">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border-light bg-surface-light">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold text-brand-black">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border-light last:border-b-0">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 align-top text-brand-grey">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
