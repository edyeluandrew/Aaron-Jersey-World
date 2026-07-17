import PageMeta from '@/components/common/PageMeta';
import PageHero from '@/components/common/PageHero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ProductCatalogue from '@/components/products/ProductCatalogue';

export default function SearchPage() {
  return (
    <>
      <PageMeta
        title="Search"
        description="Search the Aaron Jersey World product catalogue."
        path="/search"
      />
      <ProductCatalogue
        hero={
          <PageHero
            eyebrow="Search"
            title="SEARCH PRODUCTS"
            description="Find jerseys, equipment, trophies and branded apparel by name or keyword."
          />
        }
        breadcrumbs={
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
        }
        emptyTitle="No products match your search"
      />
    </>
  );
}
