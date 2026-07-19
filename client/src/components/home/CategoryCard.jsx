import { Link } from 'react-router-dom';
import { catalogueItemPath } from '@/constants/catalogue';

export default function CategoryCard({ category }) {
  const imageUrl = category.imageUrls?.original || category.imageUrl || category.imageUrls?.card;

  return (
    <Link
      to={catalogueItemPath(category.slug)}
      className="group relative overflow-hidden rounded-card bg-brand-black shadow-card"
    >
      <div className="aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name}
            loading="lazy"
            className="h-full w-full object-cover opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-charcoal text-white/60">No image</div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <h3 className="font-heading text-2xl tracking-wide">{category.name.toUpperCase()}</h3>
        {category._count?.products != null && (
          <p className="mt-1 text-sm text-white/75">{category._count.products} products</p>
        )}
      </div>
    </Link>
  );
}
