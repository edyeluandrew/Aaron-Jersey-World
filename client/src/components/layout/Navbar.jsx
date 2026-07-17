import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import { NAV_LINKS } from '@/constants/navigation';
import { useSiteConfig } from '@/context/SiteSettingsContext';
import Button from '@/components/common/Button';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const { businessName, tagline } = useSiteConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-white/10 bg-brand-black text-white transition-shadow ${isScrolled ? 'shadow-lg' : ''}`}
      >
        <div className="container-content flex items-center justify-between gap-4 py-4">
          <Link to="/" className="min-w-0 shrink-0">
            <p className="font-heading text-xl tracking-wider text-brand-red md:text-2xl">
              {businessName.toUpperCase()}
            </p>
            <p className="hidden text-xs text-white/60 sm:block">{tagline}</p>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition hover:text-brand-red ${isActive ? 'text-brand-red' : 'text-white/85'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-button text-white/85 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>
            <Button to="/request-quote" size="sm" className="hidden sm:inline-flex">
              Request Quote
            </Button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-button text-white lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
