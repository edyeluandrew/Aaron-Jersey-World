import PageMeta from '@/components/common/PageMeta';
import PageHero from '@/components/common/PageHero';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import QuoteCTA from '@/components/common/QuoteCTA';
import InstitutionalForm from '@/components/forms/InstitutionalForm';

const OFFERINGS = [
  {
    title: 'School sports kits',
    description: 'House team kits, PE uniforms and inter-school competition wear with consistent branding.',
  },
  {
    title: 'Sports day supplies',
    description: 'Medals, bibs, cones, whistles and event accessories for school sports days.',
  },
  {
    title: 'Club & academy supply',
    description: 'Bulk jerseys, balls, training equipment and trophies for youth academies and clubs.',
  },
  {
    title: 'Corporate & NGO events',
    description: 'Branded t-shirts, medals and awards for charity runs, tournaments and staff events.',
  },
];

export default function InstitutionsPage() {
  return (
    <>
      <PageMeta
        title="Schools & Institutions"
        description="Bulk sports supply for schools, academies and organisations from Aaron Jersey World, Kampala."
        path="/institutions"
      />

      <PageHero
        dark
        eyebrow="Institutional supply"
        title="SCHOOLS & INSTITUTIONS"
        description="Reliable bulk supply for schools, academies, NGOs and corporate sports programmes across Uganda."
      />

      <section className="section-padding">
        <Container>
          <SectionHeading
            eyebrow="What we supply"
            title="INSTITUTIONAL SOLUTIONS"
            description="We support procurement teams, sports teachers and event organisers with quotations tailored to your budget and timeline."
            className="mb-10"
          />
          <div className="grid gap-6 md:grid-cols-2">
            {OFFERINGS.map((item) => (
              <article
                key={item.title}
                className="rounded-card border border-border-light bg-white p-6 shadow-card"
              >
                <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                <p className="text-text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-padding bg-white">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Bulk orders"
            title="REQUEST INSTITUTIONAL SUPPLY"
            description="Share your institution details and requirements. We will prepare a written quotation for your procurement process."
            className="mb-8"
          />
          <InstitutionalForm />
        </Container>
      </section>

      <section className="section-padding">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Why choose us"
            title="WHY INSTITUTIONS CHOOSE US"
            description="Aaron Jersey World combines product variety with local availability — ideal when you need one supplier for kits, equipment and awards."
            className="mb-8"
          />
          <ul className="space-y-3 text-lg text-text-muted">
            <li>Competitive bulk pricing with written quotations</li>
            <li>Mix of ready stock and made-to-order items</li>
            <li>Branding options for school crests and sponsor logos</li>
            <li>Convenient Kampala location at Arua Park Plaza</li>
          </ul>
        </Container>
      </section>

      <QuoteCTA
        title="PLAN YOUR INSTITUTIONAL ORDER"
        description="Share student numbers, sports offered and delivery timeline. Our team will prepare a tailored quotation."
        whatsappMessage="Hello Aaron Jersey World, I would like a bulk quotation for my school/institution."
      />
    </>
  );
}
