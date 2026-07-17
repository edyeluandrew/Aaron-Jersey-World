import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '@/constants';

export default function PageMeta({ title, description, path = '' }) {
  const fullTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} | Jerseys, Sports Equipment and Custom Branding in Kampala`;
  const canonical = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {path && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}
