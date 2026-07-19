import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import Container from '@/components/common/Container';
import CategoryCard from '@/components/home/CategoryCard';
import HeroSection from '@/components/home/HeroSection';
import ProductGrid from '@/components/products/ProductGrid';
import { useCategories, useFeaturedProducts } from '@/hooks/useCatalogue';
import { useHeroBanners } from '@/hooks/useBanners';
import { APP_DESCRIPTION } from '@/constants';
import { filterMainCategories } from '@/constants/catalogue';

export default function HomePage() {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const {
    data: featuredProducts = [],
    isLoading: productsLoading,
    isError: productsError,
    refetch,
  } = useFeaturedProducts(8);

  const { data: banners = [], isLoading: bannersLoading } = useHeroBanners();
  const featuredCategories = filterMainCategories(categories);

  return (
    <>
      <PageMeta
        title="Jerseys, Sports Equipment and Custom Branding in Kampala"
        description={APP_DESCRIPTION}
        path="/"
      />

      <HeroSection banners={banners} isLoading={bannersLoading} />

      <section className="section-padding">
        <Container>
          <SectionHeading
            eyebrow="Our range"
            title="BROWSE BY TYPE"
            description="Jerseys, training equipment, custom kits and trophies — tap to see every product with photos."
            className="mb-10"
          />
          {categoriesLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-card bg-white" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="section-padding bg-white">
        <Container>
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Popular right now"
              title="FEATURED PRODUCTS"
              description="A selection from our catalogue. Request a quote for pricing and availability."
            />
            <Link to="/products" className="font-semibold text-brand-red hover:underline">
              View all products
            </Link>
          </div>
          <ProductGrid
            products={featuredProducts}
            isLoading={productsLoading}
            isError={productsError}
            onRetry={refetch}
          />
        </Container>
      </section>

      <section className="section-padding bg-brand-black text-white">
        <Container className="text-center">
          <h2 className="mb-4">READY TO EQUIP YOUR TEAM?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/75">
            Request a quotation for jerseys, kits, trophies, medals, branding or institutional bulk supply.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button to="/request-quote" size="lg">
              Request a Quote
            </Button>
            <WhatsAppButton message="Hello Aaron Jersey World, I would like a quotation for my team." className="text-white" />
          </div>
        </Container>
      </section>
    </>
  );
}
