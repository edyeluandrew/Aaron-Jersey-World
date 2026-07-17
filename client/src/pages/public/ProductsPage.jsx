import PageMeta from '@/components/common/PageMeta';
import PageHero from '@/components/common/PageHero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ProductCatalogue from '@/components/products/ProductCatalogue';

export default function ProductsPage() {
  return (
    <>
      <PageMeta
        title="Products"
        description="Browse club jerseys, sports equipment, trophies, training gear and branded apparel from Aaron Jersey World."
        path="/products"
      />
      <ProductCatalogue
        hero={
          <PageHero
            eyebrow="Catalogue"
            title="ALL PRODUCTS"
            description="Search, filter and browse our full range. Confirm availability and pricing on enquiry."
          />
        }
        breadcrumbs={
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products' }]} />
        }
        emptyTitle="No products match your filters"
      />
    </>
  );
}
