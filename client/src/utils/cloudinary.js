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

/** Build a Cloudinary URL with width (and optional height) for responsive srcset. */
export function buildCloudinarySizedUrl(url, { width, height, crop = 'fill' } = {}) {
  if (!url || !isCloudinaryUrl(url) || !width) return url;

  try {
    const parsed = new URL(url);
    const uploadMarker = '/upload/';
    const markerIndex = parsed.pathname.indexOf(uploadMarker);
    if (markerIndex === -1) return url;

    const prefix = parsed.pathname.slice(0, markerIndex + uploadMarker.length);
    let assetPath = parsed.pathname.slice(markerIndex + uploadMarker.length).replace(/^v\d+\//, '');
    const segments = assetPath.split('/');
    if (segments.length > 1 && (segments[0].includes(',') || /^[a-z0-9]+_[a-z0-9]/i.test(segments[0]))) {
      assetPath = segments.slice(1).join('/');
    }

    const transforms = [
      'f_auto',
      'q_auto:best',
      `w_${width}`,
      height ? `h_${height}` : null,
      `c_${crop}`,
      'dpr_auto',
    ].filter(Boolean);

    parsed.pathname = `${prefix}${transforms.join(',')}/${assetPath}`;
    return parsed.toString();
  } catch {
    return url;
  }
}

export function buildHeroImageSrcSet(slide) {
  const original = slide.imageUrls?.original || slide.imageUrl;
  const hero = slide.imageUrls?.hero;
  const heroFull = slide.imageUrls?.heroFull;

  const candidates = [
    hero && { url: hero, width: 1000 },
    heroFull && { url: heroFull, width: 1920 },
    original && { url: original, width: 2400 },
  ];

  let entries = candidates.filter((entry) => entry?.url);

  if (entries.length <= 1 && original && isCloudinaryUrl(original)) {
    entries = [
      { url: buildCloudinarySizedUrl(original, { width: 1000, height: 1250 }), width: 1000 },
      { url: buildCloudinarySizedUrl(original, { width: 1920, height: 1200 }), width: 1920 },
      { url: original, width: 2400 },
    ];
  }

  if (entries.length === 0) return '';

  const unique = [];
  const seen = new Set();
  for (const entry of entries) {
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    unique.push(entry);
  }

  return unique.map(({ url, width }) => `${url} ${width}w`).join(', ');
}

export function getHeroImageSrc(slide) {
  return (
    slide.imageUrls?.heroFull ||
    slide.imageUrls?.hero ||
    slide.imageUrls?.original ||
    slide.imageUrl
  );
}
