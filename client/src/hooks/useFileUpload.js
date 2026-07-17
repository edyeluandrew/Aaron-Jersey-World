import { useState } from 'react';
import { toast } from 'sonner';
import { UPLOAD_MAX_BYTES, UPLOAD_MAX_FILES } from '@/constants/forms';
import { uploadRequestFile } from '@/services/requests';

export function useFileUpload(purpose) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const addFiles = async (fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;

    if (files.length + incoming.length > UPLOAD_MAX_FILES) {
      toast.error(`You can upload up to ${UPLOAD_MAX_FILES} files.`);
      return;
    }

    for (const file of incoming) {
      if (file.size > UPLOAD_MAX_BYTES) {
        toast.error(`${file.name} is too large. Maximum size is 10 MB.`);
        continue;
      }

      setIsUploading(true);
      try {
        const uploaded = await uploadRequestFile(file, purpose);
        setFiles((current) => [
          ...current,
          {
            secureUrl: uploaded.secureUrl,
            publicId: uploaded.publicId,
            originalName: uploaded.originalName || file.name,
            mimeType: uploaded.mimeType || file.type,
            fileSize: uploaded.bytes || file.size,
          },
        ]);
      } catch (error) {
        toast.error(error.message || `Failed to upload ${file.name}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeFile = (publicId) => {
    setFiles((current) => current.filter((file) => file.publicId !== publicId));
  };

  const resetFiles = () => setFiles([]);

  return {
    files,
    isUploading,
    addFiles,
    removeFile,
    resetFiles,
    setFiles,
  };
}
