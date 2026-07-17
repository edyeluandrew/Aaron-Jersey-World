import { isProduction } from './env.js';
import { isCrossOriginDeployment } from './cors.js';

export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'ajw_access_token',
  REFRESH_TOKEN: 'ajw_refresh_token',
};

export const getCookieOptions = (maxAgeMs, production = isProduction) => ({
  httpOnly: true,
  secure: production || isCrossOriginDeployment,
  sameSite: isCrossOriginDeployment ? 'none' : production ? 'strict' : 'lax',
  path: '/',
  maxAge: maxAgeMs,
});

export const clearCookieOptions = (production = isProduction) => ({
  httpOnly: true,
  secure: production || isCrossOriginDeployment,
  sameSite: isCrossOriginDeployment ? 'none' : production ? 'strict' : 'lax',
  path: '/',
});
