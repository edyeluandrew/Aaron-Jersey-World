import PageMeta from '@/components/common/PageMeta';
import PageHero from '@/components/common/PageHero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ProductCatalogue from '@/components/products/ProductCatalogue';
import QuoteCTA from '@/components/common/QuoteCTA';

export default function TrophiesAwardsPage() {
  return (
    <>
      <PageMeta
        title="Trophies & Awards"
        description="Trophies, medals and awards for tournaments, schools and corporate events from Aaron Jersey World."
        path="/trophies-awards"
      />
      <ProductCatalogue
        defaultCategory="trophies-and-medals"
        lockCategory
        hero={
          <PageHero
            eyebrow="Awards"
            title="TROPHIES & AWARDS"
            description="Celebrate winners with trophies, medals and presentation awards for sports days, leagues and corporate events."
          />
        }
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Trophies & Awards' },
            ]}
          />
        }
        emptyTitle="No trophies or awards listed yet"
      />
      <QuoteCTA
        title="CUSTOM AWARDS & BULK MEDALS"
        description="Need engraved trophies or large medal orders? Send your event details for a custom quotation."
        whatsappMessage="Hello Aaron Jersey World, I would like a quotation for trophies/medals for my event."
      />
    </>
  );
}
