import PageMeta from '@/components/common/PageMeta';
import Button from '@/components/common/Button';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import Container from '@/components/common/Container';
import HeroSection from '@/components/home/HeroSection';
import SupplyShowcaseSection from '@/components/home/SupplyShowcaseSection';
import { useHeroBanners } from '@/hooks/useBanners';
import { APP_DESCRIPTION } from '@/constants';

export default function HomePage() {
  const { data: banners = [], isLoading: bannersLoading } = useHeroBanners();

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
          <SupplyShowcaseSection />

          <div className="mt-10 text-center">
            <Button to="/products" size="lg">
              View all products
            </Button>
          </div>
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
