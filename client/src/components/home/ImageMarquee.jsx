import { useMemo, useState } from 'react';

function getImageUrl(image) {
  return image?.secureUrl || image?.urls?.original || image?.urls?.card || null;
}

export default function ImageMarquee({
  images = [],
  direction = 'left',
  itemClassName = 'h-36 w-36 sm:h-40 sm:w-40',
}) {
  const [paused, setPaused] = useState(false);

  const slides = useMemo(
    () =>
      images
        .map((image) => ({
          id: image.id,
          url: getImageUrl(image),
          alt: image.altText || 'Product photo',
        }))
        .filter((slide) => Boolean(slide.url)),
    [images],
  );

  if (!slides.length) {
    return (
      <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-border-light bg-surface-light text-sm text-text-muted sm:h-40">
        Photos coming soon
      </div>
    );
  }

  const loop = [...slides, ...slides];
  const duration = Math.max(24, slides.length * 4);

  return (
    <div
      className="group/marquee relative overflow-hidden rounded-lg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Scrolling product gallery preview"
    >
      <div
        className={`marquee-track flex w-max gap-4 ${direction === 'right' ? 'marquee-track-reverse' : ''} ${
          paused ? 'marquee-track-paused' : ''
        }`}
        style={{ '--marquee-duration': `${duration}s` }}
      >
        {loop.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
            className={`pointer-events-none shrink-0 select-none overflow-hidden rounded-lg bg-surface-light ${itemClassName}`}
          >
            <img
              src={slide.url}
              alt={slide.alt}
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-16" />
    </div>
  );
}
