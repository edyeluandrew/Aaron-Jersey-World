import { buildTelLink } from '@/utils/contact';

export default function PhoneLink({ phone, className = '', children }) {
  if (!phone) return null;

  return (
    <a href={buildTelLink(phone)} className={`hover:text-brand-red ${className}`}>
      {children || phone}
    </a>
  );
}
