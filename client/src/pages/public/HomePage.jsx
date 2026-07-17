import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageMeta from '@/components/common/PageMeta';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import Container from '@/components/common/Container';
import CategoryCard from '@/components/home/CategoryCard';
import ProductGrid from '@/components/products/ProductGrid';
import { useCategories, useFeaturedProducts } from '@/hooks/useCatalogue';
import { APP_DESCRIPTION } from '@/constants';

export default function HomePage() {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const {
    data: featuredProducts = [],
    isLoading: productsLoading,
    isError: productsError,
    refetch,
  } = useFeaturedProducts(8);

  const featuredCategories = categories.slice(0, 8);

  return (
    <>
      <PageMeta
        title="Jerseys, Sports Equipment and Custom Branding in Kampala"
        description={APP_DESCRIPTION}
        path="/"
      />

      <section className="relative overflow-hidden bg-brand-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,31,38,0.25),transparent_45%)]" />
        <Container className="relative section-padding grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-red">
              Your Life Partner
            </p>
            <h1 className="mb-6 max-w-3xl text-[2.625rem] leading-none md:text-[5rem]">
              EVERYTHING YOUR TEAM NEEDS
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-white/75">
              Club jerseys, custom teamwear, sports equipment, trophies, medals and professional branding for
              individuals, teams, schools and organisations.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button to="/products" size="lg">
                Explore Products
              </Button>
              <Button to="/request-quote" variant="secondary" size="lg">
                Request Bulk Quote
              </Button>
              <WhatsAppButton
                message="Hello Aaron Jersey World, I would like to enquire about your products and services."
                className="justify-center px-1 py-3 text-white"
              />
            </div>
            <ul className="mt-8 grid gap-3 text-sm text-white/70 sm:grid-cols-2">
              <li>Individual and bulk orders</li>
              <li>Custom branding available</li>
              <li>Kampala-based supply</li>
              <li>Institutional orders welcome</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative hidden min-h-[420px] overflow-hidden rounded-card border border-white/10 bg-brand-charcoal lg:block"
          >
            <img
              src="https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_900,h_700,c_fill/sample.jpg"
              alt="Sportswear and team equipment showcase"
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 to-transparent" />
          </motion.div>
        </Container>
      </section>

      <section className="section-padding">
        <Container>
          <SectionHeading
            eyebrow="Shop by category"
            title="FEATURED CATEGORIES"
            description="Browse jerseys, equipment, trophies, training gear and branded apparel."
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
              description="Sample catalogue items from our development database. Confirm availability on enquiry."
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
