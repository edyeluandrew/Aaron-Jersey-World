import { Link } from 'react-router-dom';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { formatProductPrice, STOCK_LABELS } from '@/utils/product';

export default function ProductCard({ product }) {
  const image = product.images?.[0];
  const imageUrl = image?.secureUrl || image?.urls?.original || image?.urls?.card;
  const stock = STOCK_LABELS[product.stockStatus] || STOCK_LABELS.CONTACT_FOR_AVAILABILITY;
  const priceLabel = formatProductPrice(product);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-border-light bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
      <Link to={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-surface-light">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={image?.altText || product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-text-muted">No image</div>
        )}
        {product.isFeatured && (
          <span className="absolute left-3 top-3">
            <Badge variant="gold">Featured</Badge>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
          {product.category?.name}
        </p>
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug text-brand-black">
          <Link to={`/products/${product.slug}`} className="hover:text-brand-red">
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={stock.variant}>{stock.label}</Badge>
            {priceLabel && <span className="text-sm font-semibold text-brand-black">{priceLabel}</span>}
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1" to={`/products/${product.slug}`}>
              View Details
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
