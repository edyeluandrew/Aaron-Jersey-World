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
import { BANNER_QUERY_KEYS } from '@/hooks/useBanners';
import {
  createAdminBanner,
  fetchAdminBanners,
  updateAdminBanner,
} from '@/services/adminBanners';
import { extractCloudinaryPublicId } from '@/utils/cloudinary';
import apiClient from '@/api/client';

export default function BannerFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const { data: banners = [], isLoading } = useQuery({
    queryKey: BANNER_QUERY_KEYS.admin,
    queryFn: fetchAdminBanners,
    enabled: isEdit,
  });

  const banner = banners.find((item) => item.id === id);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: 'Hero slide',
      subtitle: '',
      imageUrl: '',
      buttonText: '',
      buttonUrl: '',
      sortOrder: 0,
      isActive: true,
    },
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (banner) {
      reset({
        title: banner.title,
        subtitle: banner.subtitle || '',
        imageUrl: banner.imageUrl || '',
        buttonText: banner.buttonText || '',
        buttonUrl: banner.buttonUrl || '',
        sortOrder: banner.sortOrder ?? 0,
        isActive: banner.isActive,
      });
    }
  }, [banner, reset]);

  const saveMutation = useMutation({
    mutationFn: (values) => {
      const payload = {
        ...values,
        sortOrder: Number(values.sortOrder) || 0,
        imagePublicId: extractCloudinaryPublicId(values.imageUrl) || undefined,
      };
      return isEdit ? updateAdminBanner(id, payload) : createAdminBanner(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Hero slide updated' : 'Hero slide created');
      queryClient.invalidateQueries({ queryKey: BANNER_QUERY_KEYS.admin });
      queryClient.invalidateQueries({ queryKey: BANNER_QUERY_KEYS.public });
      navigate('/admin/hero-banners');
    },
    onError: (error) => toast.error(error.message || 'Failed to save hero slide'),
  });

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post('/admin/uploads/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    },
    onSuccess: (upload) => {
      setValue('imageUrl', upload.secureUrl, { shouldDirty: true });
      toast.success('Image uploaded to Cloudinary');
    },
    onError: (error) => toast.error(error.message || 'Failed to upload image'),
  });

  if (isEdit && isLoading) {
    return (
      <AdminPage title="Edit hero slide">
        <LoadingSpinner label="Loading slide..." />
      </AdminPage>
    );
  }

  if (isEdit && !isLoading && !banner) {
    return (
      <AdminPage title="Edit hero slide">
        <p className="text-text-muted">Hero slide not found.</p>
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title={isEdit ? 'Edit hero slide' : 'Add hero slide'}
      actions={
        <Button to="/admin/hero-banners" variant="secondary" size="sm">
          Back to list
        </Button>
      }
    >
      <form
        onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
        className="max-w-2xl space-y-5 rounded-card border border-border-light bg-white p-6 shadow-card"
      >
        <CloudinaryImageField
          label="Cloudinary Secure URL"
          previewUrl={imageUrl}
          urlRegister={register('imageUrl', { required: 'Image URL is required' })}
          helpText="Use folder: aaron-jersey-world/banners — upload high-res portrait photos (at least 1200×1500px) for sharp full-size display."
        />

        <p className="rounded-card border border-border-light bg-surface-light/60 px-4 py-3 text-sm text-text-muted">
          <strong className="text-brand-black">Title</strong> = big headline on the left.
          <strong className="ml-2 text-brand-black">Small label</strong> = red badge on the image (e.g. &quot;New season kits&quot;).
          Leave title blank to use the default site headline.
        </p>

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
            Upload to Cloudinary
          </Button>
        </div>

        <FormField label="Headline (optional)" htmlFor="title">
          <input id="title" className={inputClassName} {...register('title')} placeholder="Stand out with your team" />
        </FormField>

        <FormField label="Badge label (optional)" htmlFor="subtitle">
          <input id="subtitle" className={inputClassName} {...register('subtitle')} placeholder="e.g. New season kits" />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Button text (optional)" htmlFor="buttonText">
            <input id="buttonText" className={inputClassName} {...register('buttonText')} placeholder="Shop now" />
          </FormField>
          <FormField label="Button link (optional)" htmlFor="buttonUrl">
            <input id="buttonUrl" className={inputClassName} {...register('buttonUrl')} placeholder="/products" />
          </FormField>
        </div>

        <FormField label="Sort order" htmlFor="sortOrder">
          <input id="sortOrder" type="number" className={inputClassName} {...register('sortOrder')} />
        </FormField>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" {...register('isActive')} /> Show on homepage
        </label>

        <Button type="submit" isLoading={isSubmitting || saveMutation.isPending}>
          {isEdit ? 'Save slide' : 'Add slide'}
        </Button>
      </form>
    </AdminPage>
  );
}
