import Button from '@/components/common/Button';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import Container from '@/components/common/Container';

export default function QuoteCTA({
  title = 'Need a quotation?',
  description = 'Share your requirements and our team will respond with availability and pricing.',
  quotePath = '/request-quote',
  whatsappMessage = 'Hello Aaron Jersey World, I would like a quotation for my order.',
  className = '',
}) {
  return (
    <section className={`bg-brand-black text-white ${className}`}>
      <Container className="section-padding text-center">
        <h2 className="mb-4">{title}</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-white/75">{description}</p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button to={quotePath} size="lg">
            Request a Quote
          </Button>
          <WhatsAppButton message={whatsappMessage} className="text-white" />
        </div>
      </Container>
    </section>
  );
}
