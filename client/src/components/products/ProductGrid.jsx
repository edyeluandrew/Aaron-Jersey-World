import ProductCard from './ProductCard';
import { SkeletonGrid } from '@/components/common/SkeletonCard';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';

export default function ProductGrid({
  products = [],
  isLoading,
  isError,
  onRetry,
  emptyTitle,
  isFetchingMore = false,
}) {
  if (isLoading) return <SkeletonGrid count={8} />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (!products.length) {
    return (
      <EmptyState
        title={emptyTitle || 'No products found'}
        description="Try a different category or search term."
      />
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {isFetchingMore && (
        <div className="mt-8">
          <SkeletonGrid count={4} />
        </div>
      )}
    </>
  );
}
