import PageMeta from '@/components/common/PageMeta';
import Container from '@/components/common/Container';
import Button from '@/components/common/Button';

export default function PlaceholderPage({ title, description, path }) {
  return (
    <>
      <PageMeta title={title} description={description} path={path} />
      <Container className="section-padding">
        <div className="mx-auto max-w-2xl rounded-card border border-border-light bg-white p-10 text-center shadow-card">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-red">Coming in Phase 7</p>
          <h1 className="mb-4">{title}</h1>
          <p className="mb-8 text-lg text-text-muted">{description}</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/products">Browse Products</Button>
            <Button to="/" variant="secondary">
              Back Home
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
