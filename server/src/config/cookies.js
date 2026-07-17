export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'ajw_access_token',
  REFRESH_TOKEN: 'ajw_refresh_token',
};

export const getCookieOptions = (maxAgeMs, isProduction) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax',
  path: '/',
  maxAge: maxAgeMs,
});

export const clearCookieOptions = (isProduction) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax',
  path: '/',
});
