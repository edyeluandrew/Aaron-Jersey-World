import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminPage } from '@/layouts/AdminLayout';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import { ADMIN_QUERY_KEYS } from '@/constants/adminNavigation';
import { fetchAdminProducts } from '@/services/adminProducts';
import { useState } from 'react';

export default function ProductListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ADMIN_QUERY_KEYS.products({ page }),
    queryFn: () => fetchAdminProducts({ page, limit: 20 }),
  });

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (row) => (
        <div>
          <Link to={`/admin/products/${row.id}/edit`} className="font-semibold text-brand-black hover:text-brand-red">
            {row.name}
          </Link>
          <p className="text-xs text-text-muted">{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => row.category?.name || '—',
    },
    {
      key: 'stockStatus',
      label: 'Stock',
      render: (row) => row.stockStatus?.replaceAll('_', ' ').toLowerCase(),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (row) => <Badge variant={row.isActive ? 'success' : 'error'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
  ];

  return (
    <AdminPage
      title="Products"
      actions={
        <Button to="/admin/products/new" size="sm">
          Add product
        </Button>
      }
    >
      <AdminTable
        columns={columns}
        rows={data?.products || []}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyMessage="No products yet"
      />
      <Pagination meta={data?.meta} onPageChange={setPage} />
    </AdminPage>
  );
}
