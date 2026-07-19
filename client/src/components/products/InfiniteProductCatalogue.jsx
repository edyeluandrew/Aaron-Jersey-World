import { useEffect, useMemo, useRef } from 'react';
import Button from '@/components/common/Button';
import ProductGrid from '@/components/products/ProductGrid';
import { useInfiniteProducts } from '@/hooks/useCatalogue';

export default function InfiniteProductCatalogue({
  categorySlug,
  categoryName,
  productCount,
  emptyTitle,
}) {
  const loadMoreRef = useRef(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts({
    category: categorySlug,
    sort: 'featured',
    limit: 100,
  });

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data],
  );

  const total = data?.pages[0]?.meta?.total ?? productCount ?? products.length;

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasNextPage || isFetchingNextPage) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: '400px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      {!isLoading && products.length > 0 && (
        <p className="mb-6 text-sm text-text-muted">
          Showing {products.length} of {total} product{total === 1 ? '' : 's'}
          {categoryName ? ` in ${categoryName}` : ''}
        </p>
      )}

      <ProductGrid
        products={products}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle={emptyTitle}
        isFetchingMore={isFetchingNextPage}
      />

      {hasNextPage && (
        <div ref={loadMoreRef} className="mt-10 flex justify-center">
          <Button
            variant="secondary"
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
          >
            Load more products
          </Button>
        </div>
      )}
    </>
  );
}
