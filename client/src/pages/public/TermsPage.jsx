import PageMeta from '@/components/common/PageMeta';
import PageHero from '@/components/common/PageHero';
import Container from '@/components/common/Container';

export default function TermsPage() {
  return (
    <>
      <PageMeta
        title="Terms & Conditions"
        description="Terms and conditions for using the Aaron Jersey World website and enquiry services."
        path="/terms"
      />

      <PageHero
        eyebrow="Legal"
        title="TERMS & CONDITIONS"
        description="Please read these terms before using our website or placing an enquiry."
      />

      <section className="section-padding">
        <Container className="max-w-3xl space-y-8 text-text-muted">
          <section>
            <h2 className="mb-3 text-brand-black">Website use</h2>
            <p>
              This website provides product information and enquiry channels. Product availability, pricing and
              specifications are subject to confirmation at the time of quotation or purchase.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-brand-black">Quotations and orders</h2>
            <p>
              Quotes shared via WhatsApp, phone, email or this website are valid for the period stated in the quotation.
              Orders are confirmed only after mutual agreement on price, specifications and payment terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-brand-black">Product images</h2>
            <p>
              Images are for illustration. Colours, branding placement and minor design details may vary depending on
              manufacturer batches and customisation options.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-brand-black">Custom branding</h2>
            <p>
              Custom orders may require artwork approval before production. Customers are responsible for confirming
              spelling, numbers and logo placement on approved proofs.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-brand-black">Limitation of liability</h2>
            <p>
              Aaron Jersey World is not liable for indirect losses arising from website downtime or delays outside our
              reasonable control. Nothing in these terms limits rights that cannot be excluded under applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-brand-black">Changes</h2>
            <p>
              We may update these terms from time to time. Continued use of the website after changes are posted
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <p className="text-sm">Last updated: July 2026</p>
        </Container>
      </section>
    </>
  );
}
