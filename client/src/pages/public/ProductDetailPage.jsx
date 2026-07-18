import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import PageMeta from '@/components/common/PageMeta';
import Container from '@/components/common/Container';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorState from '@/components/common/ErrorState';
import SectionHeading from '@/components/common/SectionHeading';
import ProductGallery from '@/components/products/ProductGallery';
import ProductGrid from '@/components/products/ProductGrid';
import { FormField } from '@/components/forms/FormField';
import { useProduct, useRelatedProducts } from '@/hooks/useCatalogue';
import {
  buildProductWhatsAppMessage,
  buildQuoteSearchParams,
  findMatchingVariant,
  formatProductPrice,
  getUniqueVariantValues,
  STOCK_LABELS,
} from '@/utils/product';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, isLoading, isError, refetch } = useProduct(slug);
  const { data: related = [], isLoading: relatedLoading } = useRelatedProducts(slug, 4);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColour, setSelectedColour] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <Container className="section-padding">
        <LoadingSpinner label="Loading product..." />
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <Container className="section-padding">
        <ErrorState
          title="Product not found"
          message="This product may have been removed or the link is incorrect."
          onRetry={refetch}
        />
        <div className="mt-6 text-center">
          <Button to="/products" variant="secondary">
            Back to products
          </Button>
        </div>
      </Container>
    );
  }

  const stock = STOCK_LABELS[product.stockStatus] || STOCK_LABELS.CONTACT_FOR_AVAILABILITY;
  const activeVariant = findMatchingVariant(product.variants, {
    size: selectedSize,
    colour: selectedColour,
  });
  const priceLabel = formatProductPrice(product, activeVariant);
  const sizes = getUniqueVariantValues(product.variants, 'size');
  const colours = getUniqueVariantValues(product.variants, 'colour');
  const quoteParams = buildQuoteSearchParams({
    product,
    size: selectedSize,
    colour: selectedColour,
    quantity,
  });
  const whatsappMessage = buildProductWhatsAppMessage(product, {
    size: selectedSize,
    colour: selectedColour,
    quantity,
  });

  return (
    <>
      <PageMeta
        title={product.name}
        description={product.shortDescription || product.description?.slice(0, 160)}
        path={`/products/${product.slug}`}
      />

      <Container className="section-padding">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Products', to: '/products' },
            ...(product.category
              ? [{ label: product.category.name, to: `/categories/${product.category.slug}` }]
              : []),
            { label: product.name },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} productName={product.name} />

          <div>
            {product.category && (
              <Link
                to={`/categories/${product.category.slug}`}
                className="mb-2 inline-block text-sm font-semibold uppercase tracking-wide text-brand-red hover:underline"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="mb-4">{product.name}</h1>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge variant={stock.variant}>{stock.label}</Badge>
              {product.isFeatured && <Badge variant="gold">Featured</Badge>}
              {product.brandingAvailable && <Badge variant="dark">Branding available</Badge>}
            </div>

            {priceLabel && <p className="mb-6 text-2xl font-bold text-brand-black">{priceLabel}</p>}

            {product.shortDescription && (
              <p className="mb-6 text-lg text-text-muted">{product.shortDescription}</p>
            )}

            {(sizes.length > 0 || colours.length > 0) && (
              <div className="mb-6 space-y-4 rounded-card border border-border-light bg-surface-light p-5">
                {sizes.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-semibold">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`rounded-button border px-3 py-2 text-sm font-semibold ${
                            selectedSize === size
                              ? 'border-brand-red bg-brand-red text-white'
                              : 'border-border-light bg-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {colours.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-semibold">Colour</p>
                    <div className="flex flex-wrap gap-2">
                      {colours.map((colour) => (
                        <button
                          key={colour}
                          type="button"
                          onClick={() => setSelectedColour(colour)}
                          className={`rounded-button border px-3 py-2 text-sm font-semibold ${
                            selectedColour === colour
                              ? 'border-brand-red bg-brand-red text-white'
                              : 'border-border-light bg-white'
                          }`}
                        >
                          {colour}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mb-6">
              <FormField label="Quantity" htmlFor="product-quantity">
                <input
                  id="product-quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                  className="w-full max-w-[160px] rounded-button border border-border-light bg-white px-3 py-2.5 text-sm"
                />
              </FormField>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <WhatsAppButton message={whatsappMessage} label="Enquire on WhatsApp" className="justify-center" />
              <Button to={`/request-quote?${quoteParams}`}>Request Quote</Button>
            </div>

            {product.sku && (
              <p className="mt-4 text-sm text-text-muted">
                SKU: <span className="font-medium text-brand-black">{product.sku}</span>
              </p>
            )}
          </div>
        </div>

        {product.description && (
          <section className="mt-16 max-w-4xl">
            <h2 className="mb-4">Product details</h2>
            <div className="prose prose-neutral max-w-none whitespace-pre-line text-text-muted">
              {product.description}
            </div>
          </section>
        )}
      </Container>

      <section className="section-padding bg-white">
        <Container>
          <SectionHeading
            eyebrow="You may also like"
            title="RELATED PRODUCTS"
            className="mb-8"
          />
          <ProductGrid products={related} isLoading={relatedLoading} emptyTitle="No related products" />
        </Container>
      </section>
    </>
  );
}
