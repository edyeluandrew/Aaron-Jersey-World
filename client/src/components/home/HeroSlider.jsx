import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/common/Button';

const FALLBACK_SLIDE = {
  id: 'fallback',
  title: 'Sportswear showcase',
  imageUrls: {
    hero: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_900,h_700,c_fill/sample.jpg',
  },
  imageUrl: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_900,h_700,c_fill/sample.jpg',
};

function getSlideImage(slide) {
  return slide.imageUrls?.original || slide.imageUrl || slide.imageUrls?.hero;
}

export default function HeroSlider({ banners = [], className = '' }) {
  const slides = banners.length > 0 ? banners : [FALLBACK_SLIDE];
  const [index, setIndex] = useState(0);
  const active = slides[index] ?? slides[0];
  const imageUrl = getSlideImage(active);

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const goTo = (nextIndex) => {
    setIndex((nextIndex + slides.length) % slides.length);
  };

  return (
    <div className={`relative overflow-hidden rounded-card border border-white/10 bg-brand-charcoal ${className}`}>
      <div className="relative aspect-[4/5] min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]">
        {slides.map((slide, slideIndex) => {
          const src = getSlideImage(slide);
          const isActive = slideIndex === index;

          return (
            <img
              key={slide.id}
              src={src}
              alt={slide.title || 'Hero banner'}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                isActive ? 'opacity-90' : 'pointer-events-none opacity-0'
              }`}
            />
          );
        })}

        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/10 to-transparent" />

        {(active.subtitle || active.title) && (
          <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
            {active.subtitle && (
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-red sm:text-sm">
                {active.subtitle}
              </p>
            )}
            {active.title && active.title !== 'Hero slide' && (
              <p className="font-heading text-2xl tracking-wide sm:text-3xl">{active.title.toUpperCase()}</p>
            )}
            {active.buttonText && active.buttonUrl && (
              <div className="mt-4">
                {active.buttonUrl.startsWith('http') ? (
                  <a
                    href={active.buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[40px] items-center rounded-button bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark"
                  >
                    {active.buttonText}
                  </a>
                ) : (
                  <Button to={active.buttonUrl} size="sm">
                    {active.buttonText}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/65"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/65"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((slide, slideIndex) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(slideIndex)}
                  className={`h-2.5 rounded-full transition-all ${
                    slideIndex === index ? 'w-7 bg-brand-red' : 'w-2.5 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${slideIndex + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {!banners.length && imageUrl && (
        <p className="border-t border-white/10 px-4 py-2 text-center text-xs text-white/50">
          Add hero slides in admin → Hero banners
        </p>
      )}
    </div>
  );
}
