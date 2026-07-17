import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import Container from '@/components/common/Container';
import Button from '@/components/common/Button';

export default function NotFoundPage() {
  return (
    <>
      <PageMeta title="Page Not Found" description="The page you requested could not be found." path="/404" />
      <Container className="section-padding">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-3 font-heading text-6xl text-brand-red">404</p>
          <h1 className="mb-4">PAGE NOT FOUND</h1>
          <p className="mb-8 text-lg text-text-muted">
            The page you are looking for may have moved or no longer exists.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/">Go Home</Button>
            <Button to="/products" variant="secondary">
              Browse Products
            </Button>
            <Link to="/contact" className="inline-flex items-center justify-center font-semibold text-brand-red">
              Contact us
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
