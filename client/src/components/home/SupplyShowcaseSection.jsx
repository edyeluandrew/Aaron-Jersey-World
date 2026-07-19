import SectionHeading from '@/components/common/SectionHeading';
import SupplyShowcaseCard from '@/components/home/SupplyShowcaseCard';
import { MAIN_CATEGORY_SLUGS } from '@/constants/catalogue';
import { useSupplyShowcase } from '@/hooks/useCatalogue';

function ShowcaseSkeleton() {
  return (
    <div className="space-y-8">
      {MAIN_CATEGORY_SLUGS.map((slug) => (
        <div key={slug} className="animate-pulse overflow-hidden rounded-card border border-border-light bg-white">
          <div className="border-b border-border-light px-6 py-5">
            <div className="h-8 w-48 rounded bg-surface-light" />
            <div className="mt-3 h-4 w-full max-w-xl rounded bg-surface-light" />
          </div>
          <div className="px-6 py-5">
            <div className="h-36 rounded-lg bg-surface-light sm:h-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SupplyShowcaseSection() {
  const { products, isLoading } = useSupplyShowcase();

  return (
    <>
      <SectionHeading
        eyebrow="Our range"
        title="WHAT WE SUPPLY"
        description="Jerseys, training equipment, custom kits and trophies — scroll through each range below or open the full gallery."
        className="mb-10"
      />

      {isLoading ? (
        <ShowcaseSkeleton />
      ) : (
        <div className="space-y-8">
          {products.map((product) => (
            <SupplyShowcaseCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
