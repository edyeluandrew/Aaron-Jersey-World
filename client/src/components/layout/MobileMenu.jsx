import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '@/constants/navigation';
import Button from '@/components/common/Button';

export default function MobileMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close menu overlay"
      />
      <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-brand-black p-6 text-white shadow-xl">
        <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `rounded-button px-3 py-3 text-base font-semibold ${isActive ? 'bg-brand-red text-white' : 'text-white/85 hover:bg-white/10'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-6 space-y-3">
          <Button to="/request-quote" className="w-full" onClick={onClose}>
            Request Quote
          </Button>
          <Button to="/products" variant="secondary" className="w-full" onClick={onClose}>
            Explore Products
          </Button>
        </div>
      </div>
    </div>
  );
}
