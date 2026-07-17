import { useParams } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import PageHero from '@/components/common/PageHero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Container from '@/components/common/Container';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorState from '@/components/common/ErrorState';
import Button from '@/components/common/Button';
import ProductCatalogue from '@/components/products/ProductCatalogue';
import { useCategory } from '@/hooks/useCatalogue';

export default function CategoryPage() {
  const { slug } = useParams();
  const { data: category, isLoading, isError, refetch } = useCategory(slug);

  if (isLoading) {
    return (
      <Container className="section-padding">
        <LoadingSpinner label="Loading category..." />
      </Container>
    );
  }

  if (isError || !category) {
    return (
      <Container className="section-padding">
        <ErrorState
          title="Category not found"
          message="This category may no longer be available."
          onRetry={refetch}
        />
        <div className="mt-6 text-center">
          <Button to="/products" variant="secondary">
            Browse all products
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <>
      <PageMeta
        title={category.name}
        description={category.description || `Browse ${category.name} from Aaron Jersey World.`}
        path={`/categories/${category.slug}`}
      />
      <ProductCatalogue
        defaultCategory={category.slug}
        lockCategory
        hero={
          <PageHero
            eyebrow="Category"
            title={category.name.toUpperCase()}
            description={
              category.description ||
              `Explore our ${category.name.toLowerCase()} range. Confirm availability on enquiry.`
            }
          />
        }
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Products', to: '/products' },
              { label: category.name },
            ]}
          />
        }
        emptyTitle={`No products in ${category.name} yet`}
      />
    </>
  );
}
