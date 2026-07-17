import { Link } from 'react-router-dom';
import { FOOTER_PRODUCT_LINKS, FOOTER_SERVICE_LINKS } from '@/constants/navigation';
import { useSiteConfig } from '@/context/SiteSettingsContext';
import PhoneLink from '@/components/common/PhoneLink';

export default function Footer() {
  const { businessName, tagline, address, phones, email, developerCredit } = useSiteConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-white/75">
      <div className="container-content grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-heading text-2xl tracking-wider text-brand-red">{businessName.toUpperCase()}</p>
          <p className="mt-2 text-sm">{tagline}</p>
          <p className="mt-4 text-sm leading-relaxed">
            Jerseys, sportswear, sports equipment, trophies, medals and professional branding for individuals,
            teams, schools and organisations in Kampala.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Products</h3>
          <ul className="space-y-2 text-sm">
            {FOOTER_PRODUCT_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-brand-red">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Services</h3>
          <ul className="space-y-2 text-sm">
            {FOOTER_SERVICE_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-brand-red">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>{address}</li>
            {phones.map((phone) => (
              <li key={phone}>
                <PhoneLink phone={phone} className="text-white/75 hover:text-brand-red" />
              </li>
            ))}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="hover:text-brand-red">
                  {email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-content flex flex-col gap-2 py-6 text-sm md:flex-row md:items-center md:justify-between">
          <p>&copy; {year} {businessName}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="hover:text-brand-red">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-brand-red">
              Terms
            </Link>
          </div>
          {developerCredit && <p className="text-white/50">{developerCredit}</p>}
        </div>
      </div>
    </footer>
  );
}
