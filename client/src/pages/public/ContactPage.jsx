import PageMeta from '@/components/common/PageMeta';
import PageHero from '@/components/common/PageHero';
import Container from '@/components/common/Container';
import ContactDetails from '@/components/common/ContactDetails';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import Button from '@/components/common/Button';
import InquiryForm from '@/components/forms/InquiryForm';
import { useSiteConfig } from '@/context/SiteSettingsContext';

export default function ContactPage() {
  const { mapsEmbedUrl, businessName } = useSiteConfig();

  return (
    <>
      <PageMeta
        title="Contact"
        description={`Contact ${businessName} at Arua Park Plaza, Kampala. Call, WhatsApp or visit our store.`}
        path="/contact"
      />

      <PageHero
        eyebrow="Contact"
        title="GET IN TOUCH"
        description="Visit our store, call us or send an enquiry. We are happy to help with product questions and quotations."
      />

      <section className="section-padding">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-card border border-border-light bg-white p-8 shadow-card">
            <h2 className="mb-6">Contact details</h2>
            <ContactDetails />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WhatsAppButton message="Hello Aaron Jersey World, I would like to get in touch." />
              <Button to="/request-quote" variant="secondary">
                Request Quote
              </Button>
            </div>
          </div>

          <div>
            <h2 className="mb-6">Find us</h2>
            {mapsEmbedUrl ? (
              <div className="overflow-hidden rounded-card border border-border-light">
                <iframe
                  title={`${businessName} location map`}
                  src={mapsEmbedUrl}
                  className="aspect-[4/3] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-card border border-border-light bg-surface-light p-8 text-center text-text-muted">
                Map embed can be configured in site settings. Visit us at Arua Park Plaza, Kampala.
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="section-padding bg-white">
        <Container className="max-w-3xl">
          <h2 className="mb-2">Send an enquiry</h2>
          <p className="mb-8 text-lg text-text-muted">
            Fill in the form below and our team will get back to you. You can also attach reference files if helpful.
          </p>
          <InquiryForm />
        </Container>
      </section>
    </>
  );
}
