import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Star, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/common/Button';
import { FormField } from '@/components/forms/FormField';
import { inputClassName } from '@/constants/forms';
import { ADMIN_QUERY_KEYS } from '@/constants/adminNavigation';
import { QUERY_KEYS } from '@/constants/navigation';
import {
  addAdminProductImage,
  deleteAdminProductImage,
  updateAdminProductImage,
  uploadAdminProductImage,
} from '@/services/adminProducts';
import { extractCloudinaryPublicId, isCloudinaryUrl } from '@/utils/cloudinary';

export default function ProductImagesManager({ productId, images = [] }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.product(productId) });
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.featuredProducts });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const linkMutation = useMutation({
    mutationFn: () => {
      const publicId = extractCloudinaryPublicId(imageUrl);
      if (!publicId) {
        throw new Error('Could not read the Cloudinary link. Check the Secure URL and try again.');
      }

      return addAdminProductImage(productId, {
        secureUrl: imageUrl.trim(),
        publicId,
        altText: altText.trim() || undefined,
        isPrimary: images.length === 0,
        sortOrder: images.length,
      });
    },
    onSuccess: () => {
      toast.success('Product image added');
      setImageUrl('');
      setAltText('');
      invalidate();
    },
    onError: (error) => toast.error(error.message || 'Failed to add image'),
  });

  const uploadMutation = useMutation({
    mutationFn: (file) =>
      uploadAdminProductImage(productId, file, {
        isPrimary: images.length === 0,
        sortOrder: images.length,
        altText: file.name,
      }),
    onSuccess: () => {
      toast.success('Image uploaded');
      invalidate();
    },
    onError: (error) => toast.error(error.message || 'Failed to upload image'),
  });

  const primaryMutation = useMutation({
    mutationFn: (imageId) => updateAdminProductImage(productId, imageId, { isPrimary: true }),
    onSuccess: () => {
      toast.success('Main image updated');
      invalidate();
    },
    onError: (error) => toast.error(error.message || 'Failed to update image'),
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId) => deleteAdminProductImage(productId, imageId),
    onSuccess: () => {
      toast.success('Image removed');
      invalidate();
    },
    onError: (error) => toast.error(error.message || 'Failed to remove image'),
  });

  const previewUrl = imageUrl.trim();
  const canPreview = previewUrl && isCloudinaryUrl(previewUrl);

  return (
    <div className="space-y-5 rounded-card border border-border-light bg-white p-6 shadow-card">
      <div>
        <h3 className="font-heading text-xl tracking-wide text-brand-black">PRODUCT PHOTOS</h3>
        <p className="mt-1 text-sm text-text-muted">
          Add photos already uploaded to Cloudinary, or upload a new file from your computer.
        </p>
      </div>

      {images.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {images.map((image) => (
            <li
              key={image.id}
              className="overflow-hidden rounded-card border border-border-light bg-surface-light"
            >
              <img
                src={image.imageUrls?.thumbnail || image.secureUrl}
                alt={image.altText || 'Product image'}
                className="aspect-square w-full object-cover"
              />
              <div className="flex items-center justify-between gap-2 p-3">
                <div>
                  {image.isPrimary && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-brand-red">
                      <Star className="h-3 w-3 fill-current" /> Main photo
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!image.isPrimary && (
                    <button
                      type="button"
                      onClick={() => primaryMutation.mutate(image.id)}
                      className="text-xs font-semibold text-brand-black hover:text-brand-red"
                    >
                      Set main
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Remove this image?')) deleteMutation.mutate(image.id);
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-button hover:bg-white"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-4 w-4 text-brand-red" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-4 rounded-card border border-dashed border-border-light bg-surface-light/60 p-4">
        <p className="text-sm font-semibold text-brand-black">Link a Cloudinary photo</p>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-text-muted">
          <li>Open Cloudinary → Media Library → click your image</li>
          <li>Copy the Secure URL</li>
          <li>Paste below → Add photo</li>
        </ol>

        <FormField label="Cloudinary Secure URL" htmlFor="productImageUrl">
          <input
            id="productImageUrl"
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            className={inputClassName}
            placeholder="https://res.cloudinary.com/..."
          />
        </FormField>

        <FormField label="Description (optional)" htmlFor="productImageAlt">
          <input
            id="productImageAlt"
            type="text"
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            className={inputClassName}
            placeholder="e.g. Arsenal home jersey"
          />
        </FormField>

        {canPreview && (
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-40 w-full max-w-xs rounded-button border border-border-light object-cover"
          />
        )}

        <Button
          type="button"
          onClick={() => linkMutation.mutate()}
          isLoading={linkMutation.isPending}
          disabled={!canPreview}
        >
          <ImagePlus className="h-4 w-4" />
          Add photo from link
        </Button>
      </div>

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
    </div>
  );
}
