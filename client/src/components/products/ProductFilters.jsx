import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { filterMainCategories, productsPath } from '@/constants/catalogue';
import { STOCK_STATUSES } from '@/constants';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'price-asc', label: 'Price low to high' },
  { value: 'price-desc', label: 'Price high to low' },
];

const STOCK_OPTIONS = Object.values(STOCK_STATUSES);

function FilterField({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-brand-black">{label}</label>
      {children}
    </div>
  );
}

const selectClass =
  'w-full rounded-button border border-border-light bg-white px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red';

export default function ProductFilters({
  filters,
  values,
  onChange,
  onClear,
  variant = 'sidebar',
  onOpenMobile,
  hideCategory = false,
  navigateToCategory = false,
}) {
  const navigate = useNavigate();
  const hasPriceSort = filters?.priceRange?.hasPricedProducts;
  const sortOptions = SORT_OPTIONS.filter(
    (opt) => hasPriceSort || !opt.value.startsWith('price-'),
  );

  const fields = (
    <div className="grid gap-4">
      <FilterField label="Search">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={values.search || ''}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search products..."
            className={`${selectClass} pl-9`}
          />
        </div>
      </FilterField>

      {!hideCategory && (
        <FilterField label="Category">
          <select
            value={values.category || ''}
            onChange={(e) => {
              const slug = e.target.value;
              if (navigateToCategory && slug) {
                navigate(productsPath(slug));
                return;
              }
              onChange({ category: slug });
            }}
            className={selectClass}
          >
            <option value="">All categories</option>
            {(filters?.categories || []).map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </FilterField>
      )}

      <FilterField label="Sort by">
        <select
          value={values.sort || 'featured'}
          onChange={(e) => onChange({ sort: e.target.value })}
          className={selectClass}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FilterField>

      <FilterField label="Availability">
        <select
          value={values.stockStatus || ''}
          onChange={(e) => onChange({ stockStatus: e.target.value })}
          className={selectClass}
        >
          <option value="">Any availability</option>
          {STOCK_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status.replaceAll('_', ' ').toLowerCase()}
            </option>
          ))}
        </select>
      </FilterField>

      {filters?.sizes?.length > 0 && (
        <FilterField label="Size">
          <select
            value={values.size || ''}
            onChange={(e) => onChange({ size: e.target.value })}
            className={selectClass}
          >
            <option value="">Any size</option>
            {filters.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </FilterField>
      )}

      {filters?.colours?.length > 0 && (
        <FilterField label="Colour">
          <select
            value={values.colour || ''}
            onChange={(e) => onChange({ colour: e.target.value })}
            className={selectClass}
          >
            <option value="">Any colour</option>
            {filters.colours.map((colour) => (
              <option key={colour} value={colour}>
                {colour}
              </option>
            ))}
          </select>
        </FilterField>
      )}

      {hasPriceSort && (
        <div className="grid grid-cols-2 gap-3">
          <FilterField label="Min price">
            <input
              type="number"
              min="0"
              value={values.minPrice || ''}
              onChange={(e) => onChange({ minPrice: e.target.value })}
              className={selectClass}
            />
          </FilterField>
          <FilterField label="Max price">
            <input
              type="number"
              min="0"
              value={values.maxPrice || ''}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
              className={selectClass}
            />
          </FilterField>
        </div>
      )}

      <button
        type="button"
        onClick={onClear}
        className="text-sm font-semibold text-brand-red hover:underline"
      >
        Clear all filters
      </button>
    </div>
  );

  if (variant === 'trigger') {
    return (
      <button
        type="button"
        onClick={onOpenMobile}
        className="mb-6 inline-flex items-center gap-2 rounded-button border border-border-light bg-white px-4 py-2.5 text-sm font-semibold lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>
    );
  }

  if (variant === 'drawer') {
    return fields;
  }

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 rounded-card border border-border-light bg-white p-5 shadow-card">
        <h2 className="mb-4 font-semibold">Filter products</h2>
        {fields}
      </div>
    </aside>
  );
}

export function buildFilterOptions(categories, filterMeta) {
  return {
    categories,
    sizes: filterMeta?.sizes || [],
    colours: filterMeta?.colours || [],
    priceRange: filterMeta?.priceRange || {},
  };
}
