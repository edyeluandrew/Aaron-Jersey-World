const REFRESH_TOKEN_KEY = 'ajw_refresh_token';

let accessToken = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token || null;
}

export function getRefreshToken() {
  try {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setRefreshToken(token) {
  try {
    if (token) sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
    else sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // Ignore storage failures in restricted browser modes.
  }
}

export function clearAuthTokens() {
  setAccessToken(null);
  setRefreshToken(null);
}

export function persistAuthTokens(tokens = {}) {
  if (tokens.accessToken) setAccessToken(tokens.accessToken);
  if (tokens.refreshToken) setRefreshToken(tokens.refreshToken);
}
