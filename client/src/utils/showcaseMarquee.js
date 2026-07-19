import { HOMEPAGE_MARQUEE_IMAGE_LIMIT } from '@/constants/catalogue';

function sortImages(images = []) {
  return [...images].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  });
}

export function selectShowcaseMarqueeImages(images = [], limit = HOMEPAGE_MARQUEE_IMAGE_LIMIT) {
  const sorted = sortImages(images);
  const selected = sorted.filter((image) => image.showInHomeMarquee);

  if (selected.length > 0) {
    return selected.slice(0, limit);
  }

  return sorted.slice(0, limit);
}

export function splitMarqueeRows(images = []) {
  const topRow = images.filter((_, index) => index % 2 === 0);
  const bottomRow = images.filter((_, index) => index % 2 === 1);

  return { topRow, bottomRow };
}
