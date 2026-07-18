import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { AdminPage } from '@/layouts/AdminLayout';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CloudinaryImageField from '@/components/admin/CloudinaryImageField';
import { FormField } from '@/components/forms/FormField';
import { inputClassName, textareaClassName } from '@/constants/forms';
import { ADMIN_QUERY_KEYS } from '@/constants/adminNavigation';
import { QUERY_KEYS } from '@/constants/navigation';
import {
  createAdminCategory,
  fetchAdminCategories,
  updateAdminCategory,
  uploadAdminCategoryImage,
} from '@/services/adminCategories';
import { extractCloudinaryPublicId } from '@/utils/cloudinary';

export default function CategoryFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ADMIN_QUERY_KEYS.categories,
    queryFn: fetchAdminCategories,
    enabled: isEdit,
  });

  const category = categories.find((item) => item.id === id);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      isActive: true,
      sortOrder: 0,
      imageUrl: '',
    },
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        sortOrder: category.sortOrder ?? 0,
        isActive: category.isActive,
        imageUrl: category.imageUrl || '',
      });
    }
  }, [category, reset]);

  const saveMutation = useMutation({
    mutationFn: (values) => {
      const payload = {
        ...values,
        imagePublicId: extractCloudinaryPublicId(values.imageUrl) || undefined,
      };
      return isEdit ? updateAdminCategory(id, payload) : createAdminCategory(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Category updated' : 'Category created');
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.categories });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
      navigate('/admin/categories');
    },
    onError: (error) => toast.error(error.message || 'Failed to save category'),
  });

  const uploadMutation = useMutation({
    mutationFn: (file) => uploadAdminCategoryImage(id, file),
    onSuccess: (updated) => {
      toast.success('Category image uploaded');
      reset((current) => ({ ...current, imageUrl: updated.imageUrl || '' }));
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.categories });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
    onError: (error) => toast.error(error.message || 'Failed to upload image'),
  });

  if (isEdit && isLoading) {
    return (
      <AdminPage title="Edit category">
        <LoadingSpinner label="Loading category..." />
      </AdminPage>
    );
  }

  if (isEdit && !isLoading && !category) {
    return (
      <AdminPage title="Edit category">
        <p className="text-text-muted">Category not found.</p>
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title={isEdit ? 'Edit category' : 'Add category'}
      actions={
        <Button to="/admin/categories" variant="secondary" size="sm">
          Back to list
        </Button>
      }
    >
      <form
        onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
        className="max-w-2xl space-y-5 rounded-card border border-border-light bg-white p-6 shadow-card"
      >
        <FormField label="Name" htmlFor="name">
          <input id="name" className={inputClassName} {...register('name', { required: true })} />
        </FormField>
        <FormField label="Slug" htmlFor="slug">
          <input id="slug" className={inputClassName} {...register('slug')} />
        </FormField>
        <FormField label="Description" htmlFor="description">
          <textarea id="description" className={textareaClassName} rows={4} {...register('description')} />
        </FormField>

        <CloudinaryImageField
          previewUrl={imageUrl}
          urlRegister={register('imageUrl')}
          urlError={errors.imageUrl?.message}
          helpText="This photo appears on the homepage category cards and category page."
        />

        {isEdit && (
          <div className="rounded-card border border-border-light bg-surface-light/60 p-4">
            <p className="mb-3 text-sm font-semibold text-brand-black">Or upload from computer</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) uploadMutation.mutate(file);
                event.target.value = '';
              }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              isLoading={uploadMutation.isPending}
            >
              <Upload className="h-4 w-4" />
              Upload image file
            </Button>
          </div>
        )}

        <FormField label="Sort order" htmlFor="sortOrder">
          <input id="sortOrder" type="number" className={inputClassName} {...register('sortOrder')} />
        </FormField>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" {...register('isActive')} /> Active
        </label>
        <Button type="submit" isLoading={isSubmitting || saveMutation.isPending}>
          {isEdit ? 'Save changes' : 'Create category'}
        </Button>
      </form>
    </AdminPage>
  );
}
