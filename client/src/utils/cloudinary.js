export function extractCloudinaryPublicId(url) {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    const uploadMarker = '/upload/';
    const markerIndex = parsed.pathname.indexOf(uploadMarker);
    if (markerIndex === -1) return '';

    let path = parsed.pathname.slice(markerIndex + uploadMarker.length);
    path = path.replace(/^v\d+\//, '');
    return path.replace(/\.[a-zA-Z0-9]+$/, '');
  } catch {
    return '';
  }
}

export function isCloudinaryUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('cloudinary.com');
  } catch {
    return false;
  }
}
