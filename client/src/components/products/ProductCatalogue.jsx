import { useState } from 'react';
import Container from '@/components/common/Container';
import Drawer from '@/components/common/Drawer';
import Pagination from '@/components/common/Pagination';
import ProductFilters, { buildFilterOptions } from '@/components/products/ProductFilters';
import ProductGrid from '@/components/products/ProductGrid';
import { useCategories, useProductFilters, useProducts } from '@/hooks/useCatalogue';
import { useCatalogueParams } from '@/hooks/useCatalogueParams';

export default function ProductCatalogue({
  title = 'Products',
  description,
  breadcrumbs,
  defaultCategory = '',
  lockCategory = false,
  hero,
  emptyTitle,
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { params, uiValues, updateParams, clearParams, setPage } = useCatalogueParams({
    category: defaultCategory,
    lockCategory,
  });

  const { data: categories = [] } = useCategories();
  const { data: filterMeta } = useProductFilters();
  const { data, isLoading, isError, refetch } = useProducts(params);

  const filterOptions = buildFilterOptions(categories, filterMeta);

  const handleChange = (updates) => {
    if (lockCategory && 'category' in updates) {
      return;
    }
    updateParams(updates);
  };

  const handleClear = () => {
    clearParams();
    setMobileFiltersOpen(false);
  };

  const filterProps = {
    filters: filterOptions,
    values: uiValues,
    onChange: handleChange,
    onClear: handleClear,
    hideCategory: lockCategory,
  };

  return (
    <>
      {hero}
      <Container className="section-padding">
        {breadcrumbs}
        {!hero && (
          <div className="mb-8">
            <h1 className="mb-3">{title}</h1>
            {description && <p className="max-w-3xl text-lg text-text-muted">{description}</p>}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <ProductFilters {...filterProps} variant="sidebar" />

          <div>
            <ProductFilters
              {...filterProps}
              variant="trigger"
              onOpenMobile={() => setMobileFiltersOpen(true)}
            />

            <ProductGrid
              products={data?.products || []}
              isLoading={isLoading}
              isError={isError}
              onRetry={refetch}
              emptyTitle={emptyTitle}
            />

            <Pagination meta={data?.meta} onPageChange={setPage} />
          </div>
        </div>
      </Container>

      <Drawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} title="Filter products">
        <ProductFilters
          {...filterProps}
          variant="drawer"
          onChange={(updates) => {
            handleChange(updates);
            setMobileFiltersOpen(false);
          }}
        />
      </Drawer>
    </>
  );
}
