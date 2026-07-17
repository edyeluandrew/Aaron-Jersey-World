import { MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from '@/utils/contact';
import { useSiteConfig } from '@/context/SiteSettingsContext';

export default function WhatsAppButton({
  message = '',
  label = 'Chat on WhatsApp',
  variant = 'inline',
  className = '',
}) {
  const { whatsapp } = useSiteConfig();
  const href = buildWhatsAppLink(whatsapp, message);

  if (variant === 'float') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] ${className}`}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 font-semibold text-[#128C7E] hover:text-[#075E54] ${className}`}
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      {label}
    </a>
  );
}
