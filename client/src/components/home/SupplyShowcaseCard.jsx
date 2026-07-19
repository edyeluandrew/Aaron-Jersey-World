import { Link } from 'react-router-dom';
import ImageMarquee from '@/components/home/ImageMarquee';
import { catalogueItemPath, getMainCategoryMeta } from '@/constants/catalogue';

export default function SupplyShowcaseCard({ product }) {
  const meta = getMainCategoryMeta(product.slug);
  const title = product.name || meta?.name || product.slug;
  const description = product.shortDescription || meta?.description;

  return (
    <article className="overflow-hidden rounded-card border border-border-light bg-white shadow-card">
      <div className="flex flex-col gap-4 border-b border-border-light px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <h3 className="font-heading text-3xl tracking-wide text-brand-black sm:text-4xl">
            {title.toUpperCase()}
          </h3>
          {description && (
            <p className="mt-2 max-w-2xl text-sm text-text-muted sm:text-base">{description}</p>
          )}
        </div>
        <Link
          to={catalogueItemPath(product.slug)}
          className="shrink-0 text-sm font-semibold text-brand-red transition hover:text-brand-red-dark"
        >
          View gallery →
        </Link>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <ImageMarquee images={product.images} />
      </div>
    </article>
  );
}
