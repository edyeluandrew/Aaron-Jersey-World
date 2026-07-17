import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AdminPage } from '@/layouts/AdminLayout';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorState from '@/components/common/ErrorState';
import { FormField } from '@/components/forms/FormField';
import { inputClassName, selectClassName, textareaClassName } from '@/constants/forms';
import { ADMIN_QUERY_KEYS } from '@/constants/adminNavigation';
import { PRICE_TYPES, STOCK_STATUSES } from '@/constants';
import { fetchCategories } from '@/services/catalogue';
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminProduct,
  updateAdminProduct,
} from '@/services/adminProducts';

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: product, isLoading, isError, refetch } = useQuery({
    queryKey: ADMIN_QUERY_KEYS.product(id),
    queryFn: () => fetchAdminProduct(id),
    enabled: isEdit,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      currency: 'UGX',
      priceType: 'FIXED',
      stockStatus: 'CONTACT_FOR_AVAILABILITY',
      isActive: true,
      isFeatured: false,
      isPriceVisible: true,
      brandingAvailable: false,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        categoryId: product.categoryId,
        sku: product.sku || '',
        price: product.price ?? '',
        priceType: product.priceType,
        currency: product.currency || 'UGX',
        isPriceVisible: product.isPriceVisible,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        stockStatus: product.stockStatus,
        brandingAvailable: product.brandingAvailable,
      });
    }
  }, [product, reset]);

  const saveMutation = useMutation({
    mutationFn: (values) => {
      const payload = {
        ...values,
        price: values.price === '' ? null : Number(values.price),
      };
      return isEdit ? updateAdminProduct(id, payload) : createAdminProduct(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Product updated' : 'Product created');
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      navigate('/admin/products');
    },
    onError: (error) => toast.error(error.message || 'Failed to save product'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAdminProduct(id),
    onSuccess: () => {
      toast.success('Product deleted');
      navigate('/admin/products');
    },
    onError: (error) => toast.error(error.message || 'Failed to delete product'),
  });

  if (isEdit && isLoading) {
    return (
      <AdminPage title="Edit product">
        <LoadingSpinner label="Loading product..." />
      </AdminPage>
    );
  }

  if (isEdit && isError) {
    return (
      <AdminPage title="Edit product">
        <ErrorState onRetry={refetch} />
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title={isEdit ? 'Edit product' : 'Add product'}
      actions={
        <Button to="/admin/products" variant="secondary" size="sm">
          Back to list
        </Button>
      }
    >
      <form
        onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
        className="max-w-3xl space-y-5 rounded-card border border-border-light bg-white p-6 shadow-card"
        noValidate
      >
        <FormField label="Name" htmlFor="name" required error={errors.name?.message}>
          <input id="name" className={inputClassName} {...register('name', { required: 'Name is required' })} />
        </FormField>

        <FormField label="Slug" htmlFor="slug">
          <input id="slug" className={inputClassName} {...register('slug')} />
        </FormField>

        <FormField label="Category" htmlFor="categoryId" required error={errors.categoryId?.message}>
          <select id="categoryId" className={selectClassName} {...register('categoryId', { required: 'Category is required' })}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Price (UGX)" htmlFor="price">
            <input id="price" type="number" min="0" className={inputClassName} {...register('price')} />
          </FormField>
          <FormField label="Price type" htmlFor="priceType">
            <select id="priceType" className={selectClassName} {...register('priceType')}>
              {Object.values(PRICE_TYPES).map((type) => (
                <option key={type} value={type}>
                  {type.replaceAll('_', ' ').toLowerCase()}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="Stock status" htmlFor="stockStatus">
          <select id="stockStatus" className={selectClassName} {...register('stockStatus')}>
            {Object.values(STOCK_STATUSES).map((status) => (
              <option key={status} value={status}>
                {status.replaceAll('_', ' ').toLowerCase()}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Short description" htmlFor="shortDescription">
          <textarea id="shortDescription" className={textareaClassName} rows={3} {...register('shortDescription')} />
        </FormField>

        <FormField label="Description" htmlFor="description">
          <textarea id="description" className={textareaClassName} rows={6} {...register('description')} />
        </FormField>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" {...register('isActive')} /> Active
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" {...register('isFeatured')} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" {...register('isPriceVisible')} /> Price visible
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" {...register('brandingAvailable')} /> Branding available
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" isLoading={isSubmitting || saveMutation.isPending}>
            {isEdit ? 'Save changes' : 'Create product'}
          </Button>
          {isEdit && product?.slug && (
            <Link to={`/products/${product.slug}`} className="inline-flex items-center text-sm font-semibold text-brand-red hover:underline">
              View on site
            </Link>
          )}
          {isEdit && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (window.confirm('Delete this product?')) deleteMutation.mutate();
              }}
              isLoading={deleteMutation.isPending}
            >
              Delete
            </Button>
          )}
        </div>
      </form>
    </AdminPage>
  );
}
