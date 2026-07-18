import PageMeta from '@/components/common/PageMeta';
import PageHero from '@/components/common/PageHero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ProductCatalogue from '@/components/products/ProductCatalogue';

export default function AllProductsPage() {
  return (
    <>
      <PageMeta
        title="All Products"
        description="Search, filter and browse our full product catalogue from Aaron Jersey World."
        path="/products/all"
      />
      <ProductCatalogue
        hero={
          <PageHero
            eyebrow="Full catalogue"
            title="ALL PRODUCTS"
            description="Search, filter and browse our full range. Confirm availability and pricing on enquiry."
          />
        }
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Products', to: '/products' },
              { label: 'All products' },
            ]}
          />
        }
        emptyTitle="No products match your filters"
      />
    </>
  );
}
