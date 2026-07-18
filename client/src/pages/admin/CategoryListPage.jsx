import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AdminPage } from '@/layouts/AdminLayout';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { ADMIN_QUERY_KEYS } from '@/constants/adminNavigation';
import { deleteAdminCategory, fetchAdminCategories } from '@/services/adminCategories';

export default function CategoryListPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ADMIN_QUERY_KEYS.categories,
    queryFn: fetchAdminCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.categories });
    },
    onError: (error) => toast.error(error.message || 'Failed to delete category'),
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
          <Link to={`/categories/${row.slug}`} className="text-sm font-semibold text-text-muted hover:text-brand-black hover:underline">
            View site
          </Link>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete ${row.name}?`)) deleteMutation.mutate(row.id);
            }}
            className="text-sm font-semibold text-error hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminPage
      title="Categories"
      actions={
        <Button to="/admin/categories/new" size="sm">
          Add category
        </Button>
      }
    >
      <AdminTable columns={columns} rows={data} isLoading={isLoading} isError={isError} onRetry={refetch} />
    </AdminPage>
  );
}
