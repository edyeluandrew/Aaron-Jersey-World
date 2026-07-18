import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { AdminPage } from '@/layouts/AdminLayout';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import { ADMIN_QUERY_KEYS } from '@/constants/adminNavigation';
import { MAIN_CATEGORIES } from '@/constants/catalogue';
import { fetchAdminProducts } from '@/services/adminProducts';
import { selectClassName } from '@/constants/forms';

export default function ProductListPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ADMIN_QUERY_KEYS.products({ page, category }),
    queryFn: () => fetchAdminProducts({ page, limit: 20, category: category || undefined }),
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
      description="Manage products under the four main catalogue categories."
      actions={
        <Button to="/admin/products/new" size="sm">
          Add product
        </Button>
      }
    >
      <div className="mb-6 max-w-xs">
        <label htmlFor="admin-product-category" className="mb-2 block text-sm font-semibold text-brand-black">
          Filter by category
        </label>
        <select
          id="admin-product-category"
          className={selectClassName}
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All main categories</option>
          {MAIN_CATEGORIES.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

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
