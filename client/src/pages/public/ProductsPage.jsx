import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import PageHero from '@/components/common/PageHero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Container from '@/components/common/Container';
import Button from '@/components/common/Button';
import CategoryCard from '@/components/home/CategoryCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorState from '@/components/common/ErrorState';
import { useCategories } from '@/hooks/useCatalogue';
import { filterMainCategories } from '@/constants/catalogue';

export default function ProductsPage() {
  const { data: categories = [], isLoading, isError, refetch } = useCategories();
  const mainCategories = filterMainCategories(categories);

  return (
    <>
      <PageMeta
        title="Shop by Category"
        description="Browse club jerseys, sports equipment, trophies, training gear and branded apparel by category."
        path="/products"
      />
      <PageHero
        eyebrow="Catalogue"
        title="SHOP BY CATEGORY"
        description="Choose a category to see all products with photos. We list every item in each range — even large catalogues with 100+ products."
      />
      <Container className="section-padding">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products' }]} />

        {isLoading ? (
          <LoadingSpinner label="Loading categories..." />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : mainCategories.length === 0 ? (
          <p className="text-text-muted">No categories available yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {mainCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="max-w-xl text-sm text-text-muted">
            Want to search or filter across every category at once?
          </p>
          <Button to="/products/all" variant="secondary" size="lg">
            Browse all products
          </Button>
          <Link to="/search" className="text-sm font-semibold text-brand-red hover:underline">
            Search catalogue
          </Link>
        </div>
      </Container>
    </>
  );
}
