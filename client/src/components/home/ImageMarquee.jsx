import { useMemo, useState } from 'react';
import { selectShowcaseMarqueeImages, splitMarqueeRows } from '@/utils/showcaseMarquee';

function getImageUrl(image) {
  return image?.secureUrl || image?.urls?.card || image?.urls?.original || image?.urls?.thumbnail || null;
}

function buildLoop(slides) {
  if (slides.length === 0) return [];
  if (slides.length === 1) {
    return [...slides, ...slides, ...slides, ...slides];
  }

  return [...slides, ...slides];
}

function MarqueeRow({ slides, direction = 'left', paused, itemClassName }) {
  if (!slides.length) return null;

  const loop = buildLoop(slides);
  const duration = Math.max(28, slides.length * 5);

  return (
    <div className="relative overflow-hidden">
      <div
        className={`marquee-track flex w-max flex-nowrap gap-3 sm:gap-4 ${
          direction === 'right' ? 'marquee-track-reverse' : ''
        } ${paused ? 'marquee-track-paused' : ''}`}
        style={{ '--marquee-duration': `${duration}s` }}
      >
        {loop.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
            className={`pointer-events-none shrink-0 select-none overflow-hidden rounded-lg bg-surface-light shadow-sm ${itemClassName}`}
          >
            <img
              src={slide.url}
              alt={slide.alt}
              loading="eager"
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ImageMarquee({
  images = [],
  itemClassName = 'h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36',
}) {
  const [paused, setPaused] = useState(false);

  const { topRow, bottomRow } = useMemo(() => {
    const selected = selectShowcaseMarqueeImages(images)
      .map((image) => ({
        id: image.id,
        url: getImageUrl(image),
        alt: image.altText || 'Product photo',
      }))
      .filter((slide) => Boolean(slide.url));

    return splitMarqueeRows(selected);
  }, [images]);

  const hasSlides = topRow.length > 0 || bottomRow.length > 0;

  if (!hasSlides) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border-light bg-surface-light text-sm text-text-muted">
        Add product photos in admin to show the homepage marquee
      </div>
    );
  }

  return (
    <div
      className="marquee-motion-safe relative space-y-3 overflow-hidden rounded-lg sm:space-y-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Scrolling product gallery preview"
    >
      <MarqueeRow slides={topRow} direction="left" paused={paused} itemClassName={itemClassName} />
      <MarqueeRow slides={bottomRow} direction="right" paused={paused} itemClassName={itemClassName} />

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent sm:w-14" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent sm:w-14" />
    </div>
  );
}
