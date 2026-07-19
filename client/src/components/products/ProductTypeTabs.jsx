import { Link, useSearchParams } from 'react-router-dom';
import { MAIN_CATEGORIES, catalogueItemPath, productsPath } from '@/constants/catalogue';

export default function ProductTypeTabs({ className = '' }) {
  const [searchParams] = useSearchParams();
  const activeSlug = searchParams.get('category') || '';

  const tabs = [{ name: 'All products', slug: '' }, ...MAIN_CATEGORIES];

  return (
    <nav
      className={`flex gap-2 overflow-x-auto pb-1 scrollbar-thin ${className}`}
      aria-label="Product types"
    >
      {tabs.map((tab) => {
        const isActive = activeSlug === tab.slug;
        return (
          <Link
            key={tab.slug || 'all'}
            to={tab.slug ? catalogueItemPath(tab.slug) : productsPath()}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              isActive
                ? 'bg-brand-red text-white shadow-card'
                : 'border border-border-light bg-white text-brand-black hover:border-brand-red/40 hover:text-brand-red'
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
