import PageMeta from '@/components/common/PageMeta';
import PageHero from '@/components/common/PageHero';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';
import ContactDetails from '@/components/common/ContactDetails';
import { useSiteConfig } from '@/context/SiteSettingsContext';

export default function AboutPage() {
  const { businessName, tagline, address } = useSiteConfig();

  return (
    <>
      <PageMeta
        title="About Us"
        description={`Learn about ${businessName} — your partner for jerseys, sports equipment and custom branding in Kampala.`}
        path="/about"
      />

      <PageHero
        dark
        eyebrow="About us"
        title={businessName.toUpperCase()}
        description={`${tagline}. We supply individuals, teams, schools and organisations with quality sportswear, equipment and branding from our store at ${address}.`}
      />

      <section className="section-padding">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionHeading
              eyebrow="Our story"
              title="YOUR LIFE PARTNER IN SPORTSWEAR"
              description="Aaron Jersey World started with a simple goal: make it easy for Ugandan teams and fans to find everything they need in one place."
              className="mb-8"
            />
            <div className="space-y-4 text-lg text-text-muted">
              <p>
                From club jerseys and vintage shirts to football boots, balls, trophies and training gear, we stock a
                wide range for players, coaches and event organisers.
              </p>
              <p>
                Our team also supports custom branding — logos, names, numbers and institutional crests — so your squad
                looks professional on matchday and beyond.
              </p>
              <p>
                Whether you need a single jersey or a bulk institutional order, we are here to help with honest advice,
                clear quotations and reliable local service.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/products">Browse Products</Button>
              <Button to="/contact" variant="secondary">
                Get in Touch
              </Button>
            </div>
          </div>

          <div className="rounded-card border border-border-light bg-white p-8 shadow-card">
            <h3 className="mb-6 text-2xl font-semibold">Visit our store</h3>
            <ContactDetails />
          </div>
        </Container>
      </section>

      <section className="section-padding bg-white">
        <Container>
          <SectionHeading
            eyebrow="What we do"
            title="OUR SERVICES"
            description="More than a shop — we are a full-service sportswear partner."
            className="mb-10 text-center"
            align="center"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Retail & bulk supply',
                text: 'Individual purchases and team orders for jerseys, boots, balls and accessories.',
              },
              {
                title: 'Custom branding',
                text: 'Logo printing, embroidery and personalised kits for clubs and corporates.',
              },
              {
                title: 'Institutional support',
                text: 'School kits, sports day medals and equipment packages with written quotes.',
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-card border border-border-light bg-surface-light p-6 text-center"
              >
                <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                <p className="text-text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
