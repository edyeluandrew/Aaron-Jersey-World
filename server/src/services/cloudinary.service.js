import { Readable } from 'stream';
import { AppError } from '../utils/apiResponse.js';
import { assertCloudinaryConfigured, cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import { getResourceType } from '../constants/uploads.js';

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export function uploadBuffer(buffer, options = {}) {
  if (!isCloudinaryConfigured()) {
    throw new AppError('File uploads are not configured on this server', 503);
  }

  const {
    folder,
    originalName,
    mimeType,
    publicId,
  } = options;

  const resourceType = getResourceType(mimeType);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: publicId,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          return reject(new AppError(error.message || 'File upload failed', 400));
        }
        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
          width: result.width ?? null,
          height: result.height ?? null,
          format: result.format,
          resourceType: result.resource_type,
          bytes: result.bytes,
          originalName: originalName ?? null,
          mimeType: mimeType ?? null,
        });
      },
    );

    bufferToStream(buffer).pipe(uploadStream);
  });
}

export async function deleteCloudinaryAsset(publicId, mimeType = 'image/jpeg') {
  if (!publicId) return;

  try {
    assertCloudinaryConfigured();
    const resourceType = getResourceType(mimeType);
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('[Cloudinary] Failed to delete asset:', publicId, error.message);
  }
}

export async function safeDeleteCloudinaryAsset(publicId, mimeType) {
  try {
    await deleteCloudinaryAsset(publicId, mimeType);
  } catch {
    // Already logged in deleteCloudinaryAsset
  }
}

export async function deleteMultipleAssets(assets = []) {
  await Promise.all(
    assets
      .filter((asset) => asset?.publicId)
      .map((asset) => safeDeleteCloudinaryAsset(asset.publicId, asset.mimeType || 'image/jpeg')),
  );
}

export async function listCloudinaryImagesInFolder(folderPrefix) {
  assertCloudinaryConfigured();

  const prefix = folderPrefix.replace(/^\/+|\/+$/g, '');
  if (!prefix) {
    throw new AppError('Cloudinary folder path is required', 400);
  }

  const assets = [];
  let nextCursor;

  do {
    const response = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix,
      max_results: 500,
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    });

    for (const resource of response.resources || []) {
      assets.push({
        secureUrl: resource.secure_url,
        publicId: resource.public_id,
        width: resource.width ?? null,
        height: resource.height ?? null,
      });
    }

    nextCursor = response.next_cursor;
  } while (nextCursor);

  return assets.sort((a, b) => a.publicId.localeCompare(b.publicId));
}
