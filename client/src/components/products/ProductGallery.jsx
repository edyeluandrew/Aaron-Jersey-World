import { useState } from 'react';

export default function ProductGallery({ images = [], productName = 'Product' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] || images[0];
  const mainUrl = active?.urls?.detail || active?.secureUrl;

  if (!images.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-card bg-surface-light text-text-muted">
        No image available
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 overflow-hidden rounded-card border border-border-light bg-white">
        <img
          src={mainUrl}
          alt={active?.altText || productName}
          className="aspect-square w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => {
            const thumbUrl = image.urls?.thumbnail || image.secureUrl;
            const selected = index === activeIndex;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`overflow-hidden rounded-button border-2 ${selected ? 'border-brand-red' : 'border-transparent'}`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={thumbUrl}
                  alt={image.altText || `${productName} thumbnail ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
