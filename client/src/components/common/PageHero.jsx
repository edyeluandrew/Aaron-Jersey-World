import Container from './Container';

export default function PageHero({ eyebrow, title, description, children, dark = false }) {
  return (
    <section className={dark ? 'bg-brand-black text-white' : 'border-b border-border-light bg-white'}>
      <Container className="py-12 md:py-16">
        {eyebrow && (
          <p className={`mb-3 text-sm font-semibold uppercase tracking-widest ${dark ? 'text-brand-red' : 'text-brand-red'}`}>
            {eyebrow}
          </p>
        )}
        <h1 className="mb-4 max-w-4xl">{title}</h1>
        {description && (
          <p className={`max-w-3xl text-lg ${dark ? 'text-white/75' : 'text-text-muted'}`}>{description}</p>
        )}
        {children}
      </Container>
    </section>
  );
}
