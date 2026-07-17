import { env } from './env.js';

export function parseClientOrigins(raw = env.CLIENT_URL) {
  return raw
    .split(',')
    .map((value) => value.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

function isVercelPreview(origin, allowedOrigin) {
  try {
    const allowed = new URL(allowedOrigin);
    const request = new URL(origin);

    if (!allowed.hostname.endsWith('.vercel.app') || !request.hostname.endsWith('.vercel.app')) {
      return false;
    }

    const projectSlug = allowed.hostname.replace('.vercel.app', '');
    return request.hostname === allowed.hostname || request.hostname.startsWith(`${projectSlug}-`);
  } catch {
    return false;
  }
}

export function isAllowedClientOrigin(origin, allowedOrigins = parseClientOrigins()) {
  if (!origin) return true;

  const normalizedOrigin = origin.replace(/\/$/, '');

  if (allowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  return allowedOrigins.some((allowed) => isVercelPreview(normalizedOrigin, allowed));
}

export const isCrossOriginDeployment =
  env.NODE_ENV === 'production' &&
  parseClientOrigins().some((url) => {
    try {
      return !new URL(url).hostname.includes('localhost');
    } catch {
      return false;
    }
  });
