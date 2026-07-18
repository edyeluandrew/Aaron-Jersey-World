import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AdminPage } from '@/layouts/AdminLayout';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { BANNER_QUERY_KEYS } from '@/hooks/useBanners';
import { deleteAdminBanner, fetchAdminBanners } from '@/services/adminBanners';

export default function BannerListPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: BANNER_QUERY_KEYS.admin,
    queryFn: fetchAdminBanners,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminBanner,
    onSuccess: () => {
      toast.success('Hero slide deleted');
      queryClient.invalidateQueries({ queryKey: BANNER_QUERY_KEYS.admin });
      queryClient.invalidateQueries({ queryKey: BANNER_QUERY_KEYS.public });
    },
    onError: (error) => toast.error(error.message || 'Failed to delete slide'),
  });

  const columns = [
    {
      key: 'preview',
      label: 'Preview',
      render: (row) => (
        <img
          src={row.imageUrls?.original || row.imageUrl}
          alt={row.title}
          className="h-14 w-20 rounded-button object-cover"
        />
      ),
    },
    {
      key: 'title',
      label: 'Slide',
      render: (row) => (
        <div>
          <Link to={`/admin/hero-banners/${row.id}/edit`} className="font-semibold text-brand-black hover:text-brand-red">
            {row.title}
          </Link>
          {row.subtitle && <p className="text-xs text-text-muted">{row.subtitle}</p>}
        </div>
      ),
    },
    {
      key: 'sortOrder',
      label: 'Order',
      render: (row) => row.sortOrder,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (row) => <Badge variant={row.isActive ? 'success' : 'error'}>{row.isActive ? 'Active' : 'Hidden'}</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/admin/hero-banners/${row.id}/edit`} className="text-sm font-semibold text-brand-red hover:underline">
            Edit
          </Link>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete "${row.title}"?`)) deleteMutation.mutate(row.id);
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
      title="Hero banners"
      actions={
        <Button to="/admin/hero-banners/new" size="sm">
          Add hero slide
        </Button>
      }
    >
      <p className="mb-4 max-w-3xl text-sm text-text-muted">
        Upload images to Cloudinary folder <strong>aaron-jersey-world/banners</strong>, then paste each Secure URL here.
        Active slides appear in the homepage hero slider (left text stays the same).
      </p>
      <AdminTable columns={columns} rows={data} isLoading={isLoading} isError={isError} onRetry={refetch} />
    </AdminPage>
  );
}
