import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminPage } from '@/layouts/AdminLayout';
import AdminTable from '@/components/admin/AdminTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Pagination from '@/components/common/Pagination';
import { inputClassName, selectClassName } from '@/constants/forms';
import { ADMIN_QUERY_KEYS, REQUEST_STATUS_OPTIONS, REQUEST_TYPES } from '@/constants/adminNavigation';
import { fetchAdminRequests } from '@/services/adminRequests';
import { formatAdminDate } from '@/utils/admin';

const TYPE_MAP = {
  inquiries: 'inquiries',
  quotes: 'quotes',
  branding: 'branding',
  institutional: 'institutional',
};

export default function RequestListPage() {
  const { pathname } = useLocation();
  const type = pathname.split('/')[2] || 'inquiries';
  const requestType = TYPE_MAP[type] || 'inquiries';
  const config = REQUEST_TYPES[requestType];
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const params = useMemo(
    () => ({
      page,
      limit: 20,
      ...(status ? { status } : {}),
      ...(search ? { search } : {}),
    }),
    [page, status, search],
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ADMIN_QUERY_KEYS.requests(requestType, params),
    queryFn: () => fetchAdminRequests(requestType, params),
  });

  const columns = [
    {
      key: 'referenceNumber',
      label: 'Reference',
      render: (row) => (
        <Link to={`/admin/${type}/${row.id}`} className="font-semibold text-brand-red hover:underline">
          {row.referenceNumber}
        </Link>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (row) => (
        <div>
          <p className="font-semibold text-brand-black">
            {row.fullName || row.customerName || row.contactPerson || row.institutionName}
          </p>
          <p className="text-xs text-text-muted">{row.phone}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'createdAt',
      label: 'Submitted',
      render: (row) => formatAdminDate(row.createdAt),
    },
  ];

  return (
    <AdminPage title={config.label}>
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_220px]">
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search reference, name, phone..."
          className={inputClassName}
        />
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className={selectClassName}
        >
          <option value="">All statuses</option>
          {REQUEST_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <AdminTable
        columns={columns}
        rows={data?.records || []}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyMessage={`No ${config.label.toLowerCase()} yet`}
      />
      <Pagination meta={data?.meta} onPageChange={setPage} />
    </AdminPage>
  );
}
