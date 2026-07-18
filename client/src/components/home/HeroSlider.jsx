import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FALLBACK_SLIDE = {
  id: 'fallback',
  title: 'Sportswear showcase',
  imageUrls: {
    hero: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto:good,w_1200,h_675,c_fill,e_brightness:30/sample.jpg',
  },
  imageUrl: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto:good,w_1200,h_675,c_fill,e_brightness:30/sample.jpg',
};

function getSlideImage(slide) {
  return slide.imageUrls?.hero || slide.imageUrls?.original || slide.imageUrl;
}

export default function HeroSlider({ banners = [], variant = 'background', className = '' }) {
  const isBackground = variant === 'background';
  const slides = banners.length > 0 ? banners : [FALLBACK_SLIDE];
  const [index, setIndex] = useState(0);

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
    <div
      className={`${
        isBackground
          ? 'absolute inset-0 h-full w-full'
          : 'relative overflow-hidden rounded-card border border-white/10 bg-brand-charcoal'
      } ${className}`}
      aria-hidden={isBackground}
    >
      <div className={isBackground ? 'relative h-full w-full bg-brand-black' : 'relative aspect-[4/5] min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]'}>
        {slides.map((slide, slideIndex) => {
          const src = getSlideImage(slide);
          const isActive = slideIndex === index;

          return (
            <img
              key={slide.id}
              src={src}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
                isBackground ? 'scale-[0.92] brightness-[1.15] saturate-[1.08]' : ''
              } ${isActive ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            />
          );
        })}

        {isBackground ? (
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/55 via-brand-black/25 to-transparent" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/10 to-transparent" />
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className={`absolute top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/65 ${
              isBackground ? 'left-4 md:left-8' : 'left-3'
            }`}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className={`absolute top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/65 ${
              isBackground ? 'right-4 md:right-8' : 'right-3'
            }`}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            className={`absolute z-10 flex gap-2 ${
              isBackground ? 'bottom-6 left-1/2 -translate-x-1/2' : 'bottom-3 left-1/2 -translate-x-1/2'
            }`}
          >
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
  );
}
