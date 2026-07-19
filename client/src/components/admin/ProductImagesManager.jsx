import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderOpen, ImagePlus, Star, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/common/Button';
import { FormField } from '@/components/forms/FormField';
import { inputClassName, textareaClassName } from '@/constants/forms';
import { ADMIN_QUERY_KEYS } from '@/constants/adminNavigation';
import { QUERY_KEYS } from '@/constants/navigation';
import {
  addAdminProductImage,
  deleteAdminProductImage,
  importAdminProductImagesFromFolder,
  updateAdminProductImage,
  uploadAdminProductImage,
} from '@/services/adminProducts';
import { defaultProductCloudinaryFolder } from '@/constants/catalogue';
import { extractCloudinaryPublicId, isCloudinaryUrl } from '@/utils/cloudinary';

function parseCloudinaryUrls(text) {
  return [
    ...new Set(
      text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && isCloudinaryUrl(line)),
    ),
  ];
}

export default function ProductImagesManager({ productId, images = [], productSlug = '' }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [altText, setAltText] = useState('');
  const [cloudinaryFolder, setCloudinaryFolder] = useState(defaultProductCloudinaryFolder(productSlug));

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.product(productId) });
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.featuredProducts });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const addImageFromUrl = async (url, { sortOrder, isPrimary, label }) => {
    const publicId = extractCloudinaryPublicId(url);
    if (!publicId) {
      throw new Error(`Could not read Cloudinary link: ${url}`);
    }

    return addAdminProductImage(productId, {
      secureUrl: url,
      publicId,
      altText: label?.trim() || undefined,
      isPrimary,
      sortOrder,
    });
  };

  const folderImportMutation = useMutation({
    mutationFn: () =>
      importAdminProductImagesFromFolder(productId, {
        folder: cloudinaryFolder.trim(),
      }),
    onSuccess: (result) => {
      toast.success(
        `Imported ${result.added} photo${result.added === 1 ? '' : 's'} from Cloudinary folder`,
      );
      invalidate();
    },
    onError: (error) => toast.error(error.message || 'Failed to import folder'),
  });

  const linkMutation = useMutation({
    mutationFn: () =>
      addImageFromUrl(imageUrl.trim(), {
        sortOrder: images.length,
        isPrimary: images.length === 0,
        label: altText,
      }),
    onSuccess: () => {
      toast.success('Product image added');
      setImageUrl('');
      setAltText('');
      invalidate();
    },
    onError: (error) => toast.error(error.message || 'Failed to add image'),
  });

  const bulkLinkMutation = useMutation({
    mutationFn: async () => {
      const urls = parseCloudinaryUrls(bulkUrls);
      if (urls.length === 0) {
        throw new Error('Paste at least one valid Cloudinary Secure URL (one per line).');
      }

      let added = 0;
      let sortOrder = images.length;

      for (const url of urls) {
        await addImageFromUrl(url, {
          sortOrder,
          isPrimary: images.length === 0 && added === 0,
        });
        sortOrder += 1;
        added += 1;
      }

      return added;
    },
    onSuccess: (count) => {
      toast.success(`Added ${count} photo${count === 1 ? '' : 's'}`);
      setBulkUrls('');
      invalidate();
    },
    onError: (error) => toast.error(error.message || 'Failed to add images'),
  });

  const uploadMutation = useMutation({
    mutationFn: async (files) => {
      const list = Array.from(files);
      let sortOrder = images.length;

      for (let index = 0; index < list.length; index += 1) {
        const file = list[index];
        await uploadAdminProductImage(productId, file, {
          isPrimary: images.length === 0 && index === 0,
          sortOrder,
          altText: file.name,
        });
        sortOrder += 1;
      }

      return list.length;
    },
    onSuccess: (count) => {
      toast.success(count === 1 ? 'Image uploaded' : `${count} images uploaded`);
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
  const bulkUrlCount = parseCloudinaryUrls(bulkUrls).length;
  const isBusy =
    folderImportMutation.isPending ||
    linkMutation.isPending ||
    bulkLinkMutation.isPending ||
    uploadMutation.isPending;

  return (
    <div className="space-y-5 rounded-card border border-border-light bg-white p-6 shadow-card">
      <div>
        <h3 className="font-heading text-xl tracking-wide text-brand-black">PRODUCT PHOTOS</h3>
        <p className="mt-1 text-sm text-text-muted">
          Easiest: import every image already sitting in one Cloudinary folder. Collection share
          links do not work here — use the folder path instead.
        </p>
      </div>

      {images.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <div className="space-y-4 rounded-card border-2 border-brand-red/20 bg-brand-red/5 p-4">
        <p className="text-sm font-semibold text-brand-black">Best option — import whole folder</p>
        <p className="text-sm text-text-muted">
          Cloudinary uses folder paths like{' '}
          <code className="rounded bg-white px-1">aaron-jersey-world/categories/Club Jerseys</code>.
          Collection share links do not work here.
        </p>

        <FormField label="Cloudinary folder path" htmlFor="productCloudinaryFolder">
          <input
            id="productCloudinaryFolder"
            type="text"
            value={cloudinaryFolder}
            onChange={(event) => setCloudinaryFolder(event.target.value)}
            className={inputClassName}
            placeholder="aaron-jersey-world/categories/Club Jerseys"
          />
        </FormField>

        <Button
          type="button"
          onClick={() => folderImportMutation.mutate()}
          isLoading={folderImportMutation.isPending}
          disabled={!cloudinaryFolder.trim() || isBusy}
        >
          <FolderOpen className="h-4 w-4" />
          Import all photos from this folder
        </Button>
      </div>

      <div className="space-y-4 rounded-card border border-dashed border-border-light bg-surface-light/60 p-4">
        <p className="text-sm font-semibold text-brand-black">Or paste many Secure URLs</p>
        <p className="text-sm text-text-muted">One link per line. Must start with https://res.cloudinary.com/</p>

        <FormField label="Cloudinary Secure URLs" htmlFor="productBulkImageUrls">
          <textarea
            id="productBulkImageUrls"
            rows={6}
            value={bulkUrls}
            onChange={(event) => setBulkUrls(event.target.value)}
            className={textareaClassName}
            placeholder={'https://res.cloudinary.com/dvn7pcklz/image/upload/...\nhttps://res.cloudinary.com/dvn7pcklz/image/upload/...'}
          />
        </FormField>

        {bulkUrlCount > 0 && (
          <p className="text-sm text-text-muted">
            {bulkUrlCount} valid Cloudinary link{bulkUrlCount === 1 ? '' : 's'} ready to add
          </p>
        )}

        <Button
          type="button"
          onClick={() => bulkLinkMutation.mutate()}
          isLoading={bulkLinkMutation.isPending}
          disabled={bulkUrlCount === 0 || isBusy}
        >
          <ImagePlus className="h-4 w-4" />
          Add {bulkUrlCount > 0 ? bulkUrlCount : 'all'} photo{bulkUrlCount === 1 ? '' : 's'} from links
        </Button>
      </div>

      <div className="space-y-4 rounded-card border border-dashed border-border-light bg-surface-light/60 p-4">
        <p className="text-sm font-semibold text-brand-black">Add a single Cloudinary link</p>

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
          disabled={!canPreview || isBusy}
        >
          <ImagePlus className="h-4 w-4" />
          Add photo from link
        </Button>
      </div>

      <div className="rounded-card border border-border-light bg-surface-light/60 p-4">
        <p className="mb-1 text-sm font-semibold text-brand-black">Upload from computer</p>
        <p className="mb-3 text-sm text-text-muted">Select multiple images at once if you need to.</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(event) => {
            const files = event.target.files;
            if (files?.length) uploadMutation.mutate(files);
            event.target.value = '';
          }}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          isLoading={uploadMutation.isPending}
          disabled={isBusy}
        >
          <Upload className="h-4 w-4" />
          Upload image file(s)
        </Button>
      </div>
    </div>
  );
}
