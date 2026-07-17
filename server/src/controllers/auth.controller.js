import { isProduction } from '../config/env.js';
import {
  COOKIE_NAMES,
  clearCookieOptions,
  getCookieOptions,
} from '../config/cookies.js';
import { sendSuccess } from '../utils/apiResponse.js';
import {
  changePassword,
  getCurrentUser,
  login,
  logout,
  refreshSession,
} from '../services/auth.service.js';
import {
  getAccessTokenMaxAge,
  getRefreshTokenMaxAge,
} from '../services/token.service.js';

function getRequestMeta(req) {
  return {
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  };
}

function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie(
    COOKIE_NAMES.ACCESS_TOKEN,
    accessToken,
    getCookieOptions(getAccessTokenMaxAge(), isProduction),
  );

  res.cookie(
    COOKIE_NAMES.REFRESH_TOKEN,
    refreshToken,
    getCookieOptions(getRefreshTokenMaxAge(), isProduction),
  );
}

function clearAuthCookies(res) {
  const options = clearCookieOptions(isProduction);
  res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, options);
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, options);
}

export async function loginHandler(req, res, next) {
  try {
    const result = await login({
      email: req.body.email,
      password: req.body.password,
      ...getRequestMeta(req),
    });

    setAuthCookies(res, result);

    sendSuccess(res, {
      message: 'Login successful',
      data: { user: result.user },
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshHandler(req, res, next) {
  try {
    const refreshToken = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN];

    const result = await refreshSession(refreshToken, getRequestMeta(req));

    setAuthCookies(res, result);

    sendSuccess(res, {
      message: 'Session refreshed',
      data: { user: result.user },
    });
  } catch (error) {
    clearAuthCookies(res);
    next(error);
  }
}

export async function logoutHandler(req, res, next) {
  try {
    const refreshToken = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN];

    await logout(refreshToken, req.user?.id, getRequestMeta(req));

    clearAuthCookies(res);

    sendSuccess(res, {
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function meHandler(req, res, next) {
  try {
    const user = await getCurrentUser(req.user.id);

    sendSuccess(res, {
      message: 'Current user retrieved',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

export async function changePasswordHandler(req, res, next) {
  try {
    const user = await changePassword(req.user.id, {
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
      ...getRequestMeta(req),
    });

    clearAuthCookies(res);

    sendSuccess(res, {
      message: 'Password changed successfully. Please log in again.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}
