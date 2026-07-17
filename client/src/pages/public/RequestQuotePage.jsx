import { useSearchParams } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import PageHero from '@/components/common/PageHero';
import Container from '@/components/common/Container';
import ContactDetails from '@/components/common/ContactDetails';
import QuoteForm from '@/components/forms/QuoteForm';
import { useProduct } from '@/hooks/useCatalogue';

export default function RequestQuotePage() {
  const [searchParams] = useSearchParams();
  const productSlug = searchParams.get('product');
  const { data: product } = useProduct(productSlug);

  return (
    <>
      <PageMeta
        title="Request a Quote"
        description="Request a quotation for jerseys, equipment, branding or bulk institutional orders from Aaron Jersey World."
        path="/request-quote"
      />

      <PageHero
        eyebrow="Quotations"
        title="REQUEST A QUOTE"
        description="Tell us what you need — quantities, sizes, branding and delivery timeline — and we will respond with pricing and availability."
      />

      <section className="section-padding">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-card border border-border-light bg-white p-8 shadow-card">
            <h2 className="mb-6">Quote request form</h2>
            <QuoteForm product={product} />
          </div>

          <div className="rounded-card border border-border-light bg-surface-light p-8">
            <h2 className="mb-6">Other ways to reach us</h2>
            <ContactDetails />
          </div>
        </Container>
      </section>
    </>
  );
}
