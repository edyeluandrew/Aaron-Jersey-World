import { MapPin, Phone } from 'lucide-react';
import { useSiteConfig } from '@/context/SiteSettingsContext';
import PhoneLink from '@/components/common/PhoneLink';
import WhatsAppButton from '@/components/common/WhatsAppButton';

export default function TopBar() {
  const { address, phones, businessHours } = useSiteConfig();
  const primaryPhone = phones[0];

  return (
    <div className="hidden border-b border-white/10 bg-brand-charcoal text-white/80 md:block">
      <div className="container-content flex items-center justify-between gap-4 py-2 text-sm">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            {address}
          </span>
          {primaryPhone && (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              <PhoneLink phone={primaryPhone} className="text-white/80 hover:text-white" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>{businessHours}</span>
          <WhatsAppButton label="WhatsApp" className="text-white/90" />
        </div>
      </div>
    </div>
  );
}
