import { useRef } from 'react';
import { FileText, Upload, X } from 'lucide-react';
import { FormField } from '@/components/forms/FormField';
import { UPLOAD_ACCEPT, UPLOAD_MAX_FILES } from '@/constants/forms';

export default function FileUploadField({
  label = 'Attachments',
  files = [],
  onAddFiles,
  onRemoveFile,
  isUploading = false,
  helpText = 'Upload logos, artwork or reference files (JPG, PNG, WEBP, PDF — max 10 MB each).',
}) {
  const inputRef = useRef(null);

  return (
    <FormField label={label}>
      <div className="rounded-button border border-dashed border-border-light bg-surface-light p-4">
        <input
          ref={inputRef}
          type="file"
          accept={UPLOAD_ACCEPT}
          multiple
          className="hidden"
          onChange={(event) => {
            onAddFiles(event.target.files);
            event.target.value = '';
          }}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading || files.length >= UPLOAD_MAX_FILES}
          className="inline-flex items-center gap-2 rounded-button border border-border-light bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Choose files'}
        </button>

        <p className="mt-3 text-sm text-text-muted">{helpText}</p>

        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((file) => (
              <li
                key={file.publicId}
                className="flex items-center justify-between gap-3 rounded-button border border-border-light bg-white px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-brand-red" />
                  <span className="truncate text-sm">{file.originalName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFile(file.publicId)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-button hover:bg-surface-light"
                  aria-label={`Remove ${file.originalName}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </FormField>
  );
}
