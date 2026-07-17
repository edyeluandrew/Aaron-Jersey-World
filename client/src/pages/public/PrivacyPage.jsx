import PageMeta from '@/components/common/PageMeta';
import PageHero from '@/components/common/PageHero';
import Container from '@/components/common/Container';

export default function PrivacyPage() {
  return (
    <>
      <PageMeta
        title="Privacy Policy"
        description="Privacy policy for Aaron Jersey World website and enquiry services."
        path="/privacy"
      />

      <PageHero
        eyebrow="Legal"
        title="PRIVACY POLICY"
        description="How we collect, use and protect your information when you browse our website or submit an enquiry."
      />

      <section className="section-padding">
        <Container className="max-w-3xl space-y-8 text-text-muted">
          <section>
            <h2 className="mb-3 text-brand-black">Information we collect</h2>
            <p>
              When you contact us or submit a quote request, we may collect your name, phone number, email address,
              organisation details and any information you choose to share about your order requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-brand-black">How we use your information</h2>
            <p>
              We use enquiry information to respond to your requests, prepare quotations, fulfil orders and improve our
              services. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-brand-black">Cookies and analytics</h2>
            <p>
              This website may use essential cookies for basic functionality. Additional analytics or marketing cookies
              may be introduced in future updates with appropriate notice.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-brand-black">Data retention</h2>
            <p>
              We retain enquiry and quotation records for as long as needed to manage your request, comply with business
              requirements and resolve any follow-up questions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-brand-black">Contact</h2>
            <p>
              For privacy-related questions, contact Aaron Jersey World using the details on our Contact page.
            </p>
          </section>

          <p className="text-sm">Last updated: July 2026</p>
        </Container>
      </section>
    </>
  );
}
