import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Container from '@/components/common/Container';
import Button from '@/components/common/Button';
import WhatsAppButton from '@/components/common/WhatsAppButton';

const FALLBACK_SLIDE = {
  id: 'fallback',
  title: 'Everything your team needs',
  subtitle: 'Your Life Partner',
  imageUrls: {
    hero: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto:good,w_900,h_1100,c_fill,e_brightness:20/sample.jpg',
  },
  imageUrl: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto:good,w_900,h_1100,c_fill,e_brightness:20/sample.jpg',
  buttonText: 'Explore Products',
  buttonUrl: '/products',
};

const PLACEHOLDER_TITLES = new Set([
  'hero slide',
  'sample hero banner',
  'sportswear showcase',
  'hero banner',
]);

const DEFAULT_COPY = {
  eyebrow: 'Your Life Partner',
  headline: 'Everything your team needs',
  description:
    'Club jerseys, custom teamwear, sports equipment, trophies, medals and professional branding for individuals, teams, schools and organisations.',
  primaryLabel: 'Explore Products',
  primaryUrl: '/products',
};

function getSlideImage(slide) {
  return slide.imageUrls?.hero || slide.imageUrls?.original || slide.imageUrl;
}

function getSlideCopy(slide) {
  const rawTitle = slide.title?.trim() || '';
  const headline = rawTitle && !PLACEHOLDER_TITLES.has(rawTitle.toLowerCase())
    ? rawTitle
    : DEFAULT_COPY.headline;

  const eyebrow = slide.subtitle?.trim() || DEFAULT_COPY.eyebrow;

  return {
    eyebrow,
    headline,
    description: DEFAULT_COPY.description,
    primaryLabel: slide.buttonText?.trim() || DEFAULT_COPY.primaryLabel,
    primaryUrl: slide.buttonUrl?.trim() || DEFAULT_COPY.primaryUrl,
  };
}

function HeroCta({ label, url, size = 'lg' }) {
  if (!label) return null;

  if (url.startsWith('http')) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex min-h-[48px] items-center justify-center rounded-button bg-brand-red px-8 py-3 text-base font-semibold text-white transition hover:bg-brand-red-dark active:scale-[0.98] ${size === 'sm' ? 'min-h-[40px] px-4 py-2 text-sm' : ''}`}
      >
        {label}
      </a>
    );
  }

  return (
    <Button to={url} size={size}>
      {label}
    </Button>
  );
}

export default function HeroSection({ banners = [], isLoading = false }) {
  const slides = banners.length > 0 ? banners : [FALLBACK_SLIDE];
  const [index, setIndex] = useState(0);
  const active = slides[index] ?? slides[0];
  const copy = getSlideCopy(active);

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const goTo = (nextIndex) => {
    setIndex((nextIndex + slides.length) % slides.length);
  };

  if (isLoading) {
    return (
      <section className="overflow-hidden bg-brand-black text-white">
        <Container className="section-padding">
          <div className="grid min-h-[520px] animate-pulse items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <div className="h-4 w-32 rounded-full bg-white/10" />
              <div className="h-16 w-full max-w-md rounded-card bg-white/10" />
              <div className="h-20 w-full max-w-lg rounded-card bg-white/10" />
              <div className="h-12 w-48 rounded-button bg-white/10" />
            </div>
            <div className="aspect-[4/5] rounded-[1.75rem] bg-white/10" />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-brand-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,31,38,0.18),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(245,183,0,0.08),transparent_35%)]" />

      <Container className="relative section-padding">
        <div className="grid min-h-[520px] items-center gap-10 lg:min-h-[600px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${active.id}-copy`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="max-w-xl"
              >
                <span className="mb-5 inline-flex rounded-full border border-brand-red/30 bg-brand-red/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
                  {copy.eyebrow}
                </span>

                <h1 className="mb-6 font-heading text-[2.75rem] leading-[0.95] tracking-wide md:text-[4.5rem] lg:text-[5rem]">
                  {copy.headline}
                </h1>

                <p className="mb-8 max-w-lg text-base leading-relaxed text-white/78 md:text-lg">
                  {copy.description}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <HeroCta label={copy.primaryLabel} url={copy.primaryUrl} />
                  <Button to="/request-quote" variant="secondary" size="lg">
                    Request Bulk Quote
                  </Button>
                </div>

                <div className="mt-6">
                  <WhatsAppButton
                    message="Hello Aaron Jersey World, I would like to enquire about your products and services."
                    className="justify-start px-0 py-2 text-white/85 hover:text-white"
                  />
                </div>

                <ul className="mt-8 grid gap-2.5 text-sm text-white/65 sm:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    Individual and bulk orders
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    Custom branding available
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    Kampala-based supply
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    Institutional orders welcome
                  </li>
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-red/20 via-transparent to-brand-gold/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-brand-charcoal shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                <div className="relative aspect-[4/5] sm:aspect-[5/6]">
                  {slides.map((slide, slideIndex) => {
                    const src = getSlideImage(slide);
                    const isActive = slideIndex === index;

                    return (
                      <motion.img
                        key={slide.id}
                        src={src}
                        alt={slide.title || 'Hero banner'}
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          scale: isActive ? 1 : 1.04,
                        }}
                        transition={{ duration: 0.75, ease: 'easeOut' }}
                        className="absolute inset-0 h-full w-full object-cover object-center brightness-[1.08] saturate-[1.05]"
                      />
                    );
                  })}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black/35 via-transparent to-transparent" />

                  {copy.eyebrow && (
                    <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-black shadow-card">
                      {copy.eyebrow}
                    </div>
                  )}

                  {slides.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => goTo(index - 1)}
                        className="absolute left-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => goTo(index + 1)}
                        className="absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {slides.length > 1 && (
                <div className="mt-5 flex items-center justify-center gap-2">
                  {slides.map((slide, slideIndex) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => goTo(slideIndex)}
                      className={`h-2.5 rounded-full transition-all ${
                        slideIndex === index ? 'w-8 bg-brand-red' : 'w-2.5 bg-white/35 hover:bg-white/60'
                      }`}
                      aria-label={`Go to slide ${slideIndex + 1}`}
                    />
                  ))}
                </div>
              )}

              {!banners.length && (
                <p className="mt-3 text-center text-xs text-white/45">
                  Add your photos in admin →{' '}
                  <Link to="/admin/hero-banners" className="text-brand-red hover:underline">
                    Hero banners
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
