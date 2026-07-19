import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminPage } from '@/layouts/AdminLayout';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/common/Badge';
import { ADMIN_QUERY_KEYS } from '@/constants/adminNavigation';
import { fetchAdminCategories } from '@/services/adminCategories';
import { productsPath } from '@/constants/catalogue';

export default function CategoryListPage() {
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ADMIN_QUERY_KEYS.categories,
    queryFn: fetchAdminCategories,
  });

  const columns = [
    {
      key: 'name',
      label: 'Category',
      render: (row) => (
        <div>
          <Link to={`/admin/categories/${row.id}/edit`} className="font-semibold text-brand-black hover:text-brand-red">
            {row.name}
          </Link>
          <p className="text-xs text-text-muted">{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'products',
      label: 'Products',
      render: (row) => row._count?.products ?? row.productCount ?? 0,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (row) => <Badge variant={row.isActive ? 'success' : 'error'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/admin/categories/${row.id}/edit`} className="text-sm font-semibold text-brand-red hover:underline">
            Edit
          </Link>
          <Link to={productsPath(row.slug)} className="text-sm font-semibold text-text-muted hover:text-brand-black hover:underline">
            View site
          </Link>
        </div>
      ),
    },
  ];

  return (
    <AdminPage
      title="Main categories"
      description="These four categories power the public Products page: Jerseys, Training Equipment, Custom Kits, and Trophies and Medals."
    >
      <AdminTable columns={columns} rows={data} isLoading={isLoading} isError={isError} onRetry={refetch} />
    </AdminPage>
  );
}
