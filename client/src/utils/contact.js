import { DEFAULT_WHATSAPP } from '@/constants';

export function digitsOnly(value = '') {
  return String(value).replace(/\D/g, '');
}

export function buildWhatsAppLink(number = DEFAULT_WHATSAPP, message = '') {
  const phone = digitsOnly(number);
  const text = encodeURIComponent(message);
  return `https://wa.me/${phone}${message ? `?text=${text}` : ''}`;
}

export function buildTelLink(phone) {
  return `tel:${digitsOnly(phone)}`;
}

export function formatPhoneDisplay(phone) {
  return phone || '';
}
