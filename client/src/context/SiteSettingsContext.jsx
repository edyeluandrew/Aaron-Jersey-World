import { createContext, useContext, useMemo } from 'react';
import { CONTACT, DEFAULT_WHATSAPP } from '@/constants';
import { useSiteSettings } from '@/hooks/useCatalogue';

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const { data, isLoading, isError } = useSiteSettings();

  const value = useMemo(() => {
    const settings = data || {};

    return {
      isLoading,
      isError,
      businessName: settings.business_name || 'Aaron Jersey World',
      tagline: settings.tagline || 'Your Life Partner',
      address: settings.address || CONTACT.location,
      phones: [
        settings.phone_primary,
        settings.phone_secondary,
        settings.phone_tertiary,
      ].filter(Boolean),
      email: settings.email || '',
      whatsapp: settings.whatsapp_number || DEFAULT_WHATSAPP,
      businessHours: settings.business_hours || 'Mon–Sat: 9:00 AM – 7:00 PM',
      developerCredit: settings.developer_credit || '',
      social: {
        facebook: settings.social_facebook || '',
        instagram: settings.social_instagram || '',
        twitter: settings.social_twitter || '',
        tiktok: settings.social_tiktok || '',
      },
      mapsEmbedUrl: settings.google_maps_embed_url || import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL || '',
    };
  }, [data, isLoading, isError]);

  return (
    <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within SiteSettingsProvider');
  }
  return context;
}
