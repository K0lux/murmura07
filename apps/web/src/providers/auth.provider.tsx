import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  login as loginRequest,
  logout as logoutRequest,
  refreshToken as refreshTokenRequest,
  register as registerRequest
} from '../services/auth.service';

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    firstName?: string;
    preferredCommunicationStyle?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const storageKey = 'murmura.web.auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      setSession(JSON.parse(saved) as AuthSession);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.accessToken),
      login: async (email: string, password: string) => {
        const tokens = await loginRequest(email, password);
        const nextSession: AuthSession = {
          user: {
            id: email,
            name: email.split('@')[0] ?? 'Murmura',
            email
          },
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        };
        setSession(nextSession);
        window.localStorage.setItem(storageKey, JSON.stringify(nextSession));
      },
      register: async (payload) => {
        await registerRequest(payload);
        const tokens = await loginRequest(payload.email, payload.password);
        const nextSession: AuthSession = {
          user: {
            id: payload.email,
            name: payload.firstName?.trim() || payload.email.split('@')[0] || 'Murmura',
            email: payload.email
          },
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        };
        setSession(nextSession);
        window.localStorage.setItem(storageKey, JSON.stringify(nextSession));
      },
      logout: async () => {
        if (session?.refreshToken) {
          try {
            await logoutRequest(session.refreshToken);
          } catch {
            // Clear the local session even if the logout request fails.
          }
        }

        setSession(null);
        window.localStorage.removeItem(storageKey);
      },
      refreshToken: async () => {
        if (!session?.refreshToken) {
          return;
        }

        const tokens = await refreshTokenRequest(session.refreshToken);
        const nextSession: AuthSession = {
          user: session.user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        };
        setSession(nextSession);
        window.localStorage.setItem(storageKey, JSON.stringify(nextSession));
      }
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
