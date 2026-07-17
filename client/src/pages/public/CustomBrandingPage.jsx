import PageMeta from '@/components/common/PageMeta';
import PageHero from '@/components/common/PageHero';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import QuoteCTA from '@/components/common/QuoteCTA';
import BrandingForm from '@/components/forms/BrandingForm';

const SERVICES = [
  {
    title: 'Team logos & crests',
    description: 'Club badges, sponsor marks and crest placement on jerseys, kits and training wear.',
  },
  {
    title: 'Names & numbers',
    description: 'Player names, squad numbers and custom typography for matchday and fan jerseys.',
  },
  {
    title: 'Corporate branding',
    description: 'Company logos on t-shirts, caps, tracksuits and event merchandise.',
  },
  {
    title: 'School & institution branding',
    description: 'House colours, school crests and event branding for sports days and competitions.',
  },
];

export default function CustomBrandingPage() {
  return (
    <>
      <PageMeta
        title="Custom Branding"
        description="Professional jersey printing, embroidery and team branding services from Aaron Jersey World in Kampala."
        path="/custom-branding"
      />

      <PageHero
        dark
        eyebrow="Services"
        title="CUSTOM BRANDING"
        description="From club crests to corporate logos — we help teams, schools and organisations look professional on and off the pitch."
      />

      <section className="section-padding">
        <Container>
          <SectionHeading
            eyebrow="What we offer"
            title="BRANDING SERVICES"
            description="Share your artwork or let our team guide you through logo placement, sizing and production options."
            className="mb-10"
          />
          <div className="grid gap-6 md:grid-cols-2">
            {SERVICES.map((service) => (
              <article
                key={service.title}
                className="rounded-card border border-border-light bg-white p-6 shadow-card"
              >
                <h3 className="mb-3 text-xl font-semibold">{service.title}</h3>
                <p className="text-text-muted">{service.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-padding bg-white">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="How it works"
              title="FROM ARTWORK TO DELIVERY"
              description="Send your logo files, tell us quantities and sizes, and we will confirm pricing and turnaround time."
            />
            <ol className="mt-8 space-y-4 text-text-muted">
              <li>1. Share your branding requirements and quantities</li>
              <li>2. We confirm placement, pricing and production timeline</li>
              <li>3. Approve artwork proof before production begins</li>
              <li>4. Collect in-store or arrange delivery within Kampala</li>
            </ol>
          </div>
          <div className="rounded-card border border-border-light bg-surface-light p-8">
            <h3 className="mb-4 text-2xl font-semibold">Request branding</h3>
            <p className="mb-6 text-text-muted">
              Submit your logo files and project details below. Our team will confirm placement, pricing and turnaround
              time.
            </p>
            <BrandingForm />
          </div>
        </Container>
      </section>

      <QuoteCTA
        title="GET A BRANDING QUOTE"
        description="Tell us about your team, quantities and logo files. We will respond with options and pricing."
        whatsappMessage="Hello Aaron Jersey World, I would like a custom branding quote for my team."
      />
    </>
  );
}
