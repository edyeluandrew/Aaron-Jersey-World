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

function normalizeFolderCandidates(folderPrefix) {
  const cleaned = folderPrefix.replace(/^\/+|\/+$/g, '');
  const candidates = new Set();

  if (cleaned) candidates.add(cleaned);

  if (cleaned && !cleaned.startsWith('aaron-jersey-world/')) {
    candidates.add(`aaron-jersey-world/${cleaned}`);

    if (!cleaned.startsWith('categories/')) {
      candidates.add(`aaron-jersey-world/categories/${cleaned}`);
    }
  }

  return [...candidates];
}

function mapCloudinaryError(error, fallbackMessage) {
  const message = error?.error?.message || error.message || fallbackMessage;

  if (/api_secret|invalid api key|unknown api key|cloud name/i.test(message)) {
    return new AppError(
      'Cloudinary credentials on the server are wrong. In Render, set CLOUDINARY_CLOUD_NAME to dvn7pcklz and copy a fresh API key + secret from the Cloudinary dashboard.',
      503,
    );
  }

  const statusCode = error?.error?.http_code;
  if (statusCode === 404) {
    return null;
  }

  return new AppError(message, statusCode && statusCode >= 500 ? 502 : 400);
}

export async function verifyCloudinaryCredentials() {
  if (!isCloudinaryConfigured()) {
    return { configured: false, valid: false, message: 'Cloudinary env vars are missing' };
  }

  try {
    await cloudinary.api.ping();
    return { configured: true, valid: true };
  } catch (error) {
    return {
      configured: true,
      valid: false,
      message: error?.error?.message || error.message || 'Cloudinary ping failed',
    };
  }
}

async function listImagesByAssetFolder(folder) {
  const assets = [];
  let nextCursor;

  do {
    let response;

    try {
      response = await cloudinary.api.resources_by_asset_folder(folder, {
        max_results: 500,
        ...(nextCursor ? { next_cursor: nextCursor } : {}),
      });
    } catch (error) {
      const mapped = mapCloudinaryError(error, 'Failed to read Cloudinary folder');
      if (mapped) throw mapped;
      return [];
    }

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

  return assets;
}

async function listImagesBySearch(folder) {
  const assets = [];
  let nextCursor;

  do {
    let response;

    try {
      let query = cloudinary.search.expression(`asset_folder="${folder}"`).max_results(500);
      if (nextCursor) query = query.next_cursor(nextCursor);
      response = await query.execute();
    } catch (error) {
      const mapped = mapCloudinaryError(error, 'Failed to search Cloudinary folder');
      if (mapped) throw mapped;
      return [];
    }

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

  return assets;
}

async function listImagesByPublicIdPrefix(prefix) {
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

  return assets;
}

export async function listCloudinaryImagesInFolder(folderPrefix) {
  assertCloudinaryConfigured();

  const candidates = normalizeFolderCandidates(folderPrefix);
  if (candidates.length === 0) {
    throw new AppError('Cloudinary folder path is required', 400);
  }

  for (const folder of candidates) {
    const byAssetFolder = await listImagesByAssetFolder(folder);
    if (byAssetFolder.length > 0) {
      return byAssetFolder.sort((a, b) => a.publicId.localeCompare(b.publicId));
    }

    const bySearch = await listImagesBySearch(folder);
    if (bySearch.length > 0) {
      return bySearch.sort((a, b) => a.publicId.localeCompare(b.publicId));
    }

    const byPrefix = await listImagesByPublicIdPrefix(folder);
    if (byPrefix.length > 0) {
      return byPrefix.sort((a, b) => a.publicId.localeCompare(b.publicId));
    }
  }

  return [];
}
