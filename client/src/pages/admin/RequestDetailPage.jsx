import { Link, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AdminPage } from '@/layouts/AdminLayout';
import AttachmentList from '@/components/admin/AttachmentList';
import RequestStatusSelect from '@/components/admin/RequestStatusSelect';
import StatusBadge from '@/components/admin/StatusBadge';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorState from '@/components/common/ErrorState';
import { ADMIN_QUERY_KEYS, REQUEST_TYPES } from '@/constants/adminNavigation';
import { fetchAdminRequest, updateAdminRequestStatus } from '@/services/adminRequests';
import { formatAdminDate, formatLabel } from '@/utils/admin';
import { formatSizeQuantitiesSummary } from '@/utils/product';
import { productsPath } from '@/constants/catalogue';

const TYPE_MAP = {
  inquiries: 'inquiries',
  quotes: 'quotes',
  branding: 'branding',
  institutional: 'institutional',
};

function DetailField({ label, value, children }) {
  const content = children ?? value;
  if (content == null || content === '') return null;
  return (
    <div>
      <p className="text-sm font-semibold text-brand-black">{label}</p>
      <div className="mt-1 whitespace-pre-line text-text-muted">
        {typeof content === 'string' || typeof content === 'number' ? String(content) : content}
      </div>
    </div>
  );
}

export default function RequestDetailPage() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const type = pathname.split('/')[2] || 'inquiries';
  const requestType = TYPE_MAP[type] || 'inquiries';
  const config = REQUEST_TYPES[requestType];
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ADMIN_QUERY_KEYS.request(requestType, id),
    queryFn: () => fetchAdminRequest(requestType, id),
    enabled: Boolean(id),
  });

  const statusMutation = useMutation({
    mutationFn: (status) => updateAdminRequestStatus(requestType, id, status),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.request(requestType, id) });
      queryClient.invalidateQueries({ queryKey: ['admin', 'requests', requestType] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.dashboard });
    },
    onError: (error) => toast.error(error.message || 'Failed to update status'),
  });

  if (isLoading) {
    return (
      <AdminPage title={config.singular}>
        <LoadingSpinner label="Loading request..." />
      </AdminPage>
    );
  }

  if (isError || !data) {
    return (
      <AdminPage title={config.singular}>
        <ErrorState onRetry={refetch} />
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title={data.referenceNumber}
      actions={
        <Button to={config.listPath} variant="secondary" size="sm">
          Back to list
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-card border border-border-light bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={data.status} />
            <span className="text-sm text-text-muted">Submitted {formatAdminDate(data.createdAt)}</span>
          </div>

          <DetailField label="Type" value={formatLabel(data.type || data.institutionType || data.serviceType)} />
          <DetailField label="Name" value={data.fullName || data.customerName || data.contactPerson} />
          <DetailField label="Organisation" value={data.organisationName || data.institutionName} />
          <DetailField label="Phone" value={data.phone} />
          <DetailField label="Email" value={data.email} />
          <DetailField label="Location" value={data.location} />
          <DetailField label="Subject" value={data.subject} />
          <DetailField label="Message" value={data.message} />
          <DetailField label="Notes" value={data.notes || data.additionalNotes} />
          <DetailField label="Description" value={data.description} />
          <DetailField label="Products required" value={data.productsRequired} />
          <DetailField label="Quantity" value={data.quantity || data.estimatedQuantity} />
          <DetailField label="Selected size" value={data.selectedSize} />
          <DetailField label="Selected colour" value={data.selectedColour} />
          <DetailField
            label="Size breakdown"
            value={formatSizeQuantitiesSummary(data.sizeQuantities)}
          />
          <DetailField label="Budget" value={data.budgetRange} />
          <DetailField label="Required date" value={data.requiredDate ? formatAdminDate(data.requiredDate) : null} />
          <DetailField
            label="Preferred contact"
            value={formatLabel(data.preferredContactMethod)}
          />

          {data.product && (
            <DetailField label="Product">
              <Link to={`/products/${data.product.slug}`} className="font-semibold text-brand-red hover:underline">
                {data.product.name}
              </Link>
            </DetailField>
          )}

          {data.category && (
            <DetailField label="Category">
              <Link to={productsPath(data.category.slug)} className="font-semibold text-brand-red hover:underline">
                {data.category.name}
              </Link>
            </DetailField>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-card border border-border-light bg-white p-6 shadow-card">
            <h2 className="mb-4 text-xl font-semibold">Update status</h2>
            <RequestStatusSelect
              value={data.status}
              onChange={(status) => statusMutation.mutate(status)}
              disabled={statusMutation.isPending}
            />
          </div>

          <div className="rounded-card border border-border-light bg-white p-6 shadow-card">
            <h2 className="mb-4 text-xl font-semibold">Attachments</h2>
            <AttachmentList attachments={data.attachments} />
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
