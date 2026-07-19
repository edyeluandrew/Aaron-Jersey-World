import { Link, useSearchParams } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import PageHero from '@/components/common/PageHero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Container from '@/components/common/Container';
import ProductTypeTabs from '@/components/products/ProductTypeTabs';
import InfiniteProductCatalogue from '@/components/products/InfiniteProductCatalogue';
import { getMainCategoryMeta } from '@/constants/catalogue';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') || '';
  const activeType = getMainCategoryMeta(categorySlug);

  const pageTitle = activeType ? activeType.name : 'Our Products';
  const pageDescription = activeType
    ? activeType.description
    : 'Browse jerseys, training equipment, custom kits, trophies and medals. Tap a type to see every product with photos.';

  return (
    <>
      <PageMeta title={pageTitle} description={pageDescription} path="/products" />
      <PageHero
        eyebrow="Catalogue"
        title={activeType ? activeType.name.toUpperCase() : 'OUR PRODUCTS'}
        description={pageDescription}
      />
      <Container className="section-padding">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Products', to: '/products' },
            ...(activeType ? [{ label: activeType.name }] : []),
          ]}
        />

        <div className="mb-8 space-y-4">
          <ProductTypeTabs />
          <p className="text-sm text-text-muted">
            {activeType
              ? `All ${activeType.name.toLowerCase()} with photos — scroll for more.`
              : 'Pick jerseys, equipment, custom kits or trophies to view everything in that range.'}
          </p>
        </div>

        <InfiniteProductCatalogue
          categorySlug={categorySlug || undefined}
          categoryName={activeType?.name}
          emptyTitle={
            activeType
              ? `No ${activeType.name.toLowerCase()} listed yet`
              : 'No products listed yet'
          }
        />

        <div className="mt-12 text-center">
          <Link to="/search" className="text-sm font-semibold text-brand-red hover:underline">
            Search the full catalogue
          </Link>
        </div>
      </Container>
    </>
  );
}
