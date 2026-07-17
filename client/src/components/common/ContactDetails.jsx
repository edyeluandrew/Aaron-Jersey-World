import { Mail, MapPin, Phone } from 'lucide-react';
import { useSiteConfig } from '@/context/SiteSettingsContext';
import { buildTelLink } from '@/utils/contact';

export default function ContactDetails({ showHours = true, className = '' }) {
  const { address, phones, email, businessHours } = useSiteConfig();

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex gap-4">
        <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand-red" aria-hidden="true" />
        <div>
          <p className="font-semibold text-brand-black">Visit us</p>
          <p className="text-text-muted">{address}</p>
        </div>
      </div>

      {phones.length > 0 && (
        <div className="flex gap-4">
          <Phone className="mt-1 h-5 w-5 shrink-0 text-brand-red" aria-hidden="true" />
          <div>
            <p className="font-semibold text-brand-black">Call us</p>
            <ul className="space-y-1">
              {phones.map((phone) => (
                <li key={phone}>
                  <a href={buildTelLink(phone)} className="text-text-muted hover:text-brand-red">
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {email && (
        <div className="flex gap-4">
          <Mail className="mt-1 h-5 w-5 shrink-0 text-brand-red" aria-hidden="true" />
          <div>
            <p className="font-semibold text-brand-black">Email</p>
            <a href={`mailto:${email}`} className="text-text-muted hover:text-brand-red">
              {email}
            </a>
          </div>
        </div>
      )}

      {showHours && businessHours && (
        <div>
          <p className="font-semibold text-brand-black">Business hours</p>
          <p className="text-text-muted">{businessHours}</p>
        </div>
      )}
    </div>
  );
}
