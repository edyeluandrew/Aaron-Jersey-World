import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  refreshSession,
} from '@/services/auth';
import { clearAuthTokens, getRefreshToken } from '@/api/authToken';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      const currentUser = await fetchCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        return;
      }
    } catch {
      // Fall through to refresh when cookies are blocked cross-origin.
    }

    if (!getRefreshToken()) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await refreshSession();
      setUser(currentUser);
    } catch {
      clearAuthTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    bootstrap().finally(() => setIsBootstrapping(false));
  }, [bootstrap]);

  const login = useCallback(async (credentials) => {
    const loggedInUser = await loginRequest(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      login,
      logout,
      refreshUser: bootstrap,
    }),
    [user, isBootstrapping, login, logout, bootstrap],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
