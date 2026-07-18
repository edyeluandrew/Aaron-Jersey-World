import { FormField } from '@/components/forms/FormField';
import { inputClassName } from '@/constants/forms';
import { isCloudinaryUrl } from '@/utils/cloudinary';

export default function CloudinaryImageField({
  label = 'Image link from Cloudinary',
  urlRegister,
  urlError,
  previewUrl,
  helpText = 'In Cloudinary, open your image → copy the Secure URL → paste it here.',
}) {
  const showPreview = previewUrl && isCloudinaryUrl(previewUrl);

  return (
    <div className="space-y-4 rounded-card border border-border-light bg-surface-light/60 p-4">
      <div>
        <p className="text-sm font-semibold text-brand-black">Add a photo from Cloudinary</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-text-muted">
          <li>Open Cloudinary → Media Library</li>
          <li>Click your image</li>
          <li>Copy the <strong>Secure URL</strong></li>
          <li>Paste it below and save</li>
        </ol>
      </div>

      <FormField label={label} htmlFor="imageUrl" error={urlError}>
        <input
          id="imageUrl"
          type="url"
          className={inputClassName}
          placeholder="https://res.cloudinary.com/..."
          {...urlRegister}
        />
      </FormField>

      {helpText && <p className="text-sm text-text-muted">{helpText}</p>}

      {showPreview ? (
        <div>
          <p className="mb-2 text-sm font-medium text-brand-black">Preview</p>
          <img
            src={previewUrl}
            alt="Selected Cloudinary preview"
            className="max-h-48 w-full max-w-xs rounded-button border border-border-light object-cover"
          />
        </div>
      ) : previewUrl ? (
        <p className="text-sm text-warning">Paste a valid Cloudinary link (https://res.cloudinary.com/...)</p>
      ) : null}
    </div>
  );
}
