import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { bootstrapSession, login as doLogin, logout as doLogout } from '../api/auth';
import type { User } from '../api/types';

interface AuthState {
  user: User | null;
  permissions: string[];
  loading: boolean;
  login: (tenant: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  can: (perm: string) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bootstrapSession()
      .then((s) => {
        if (s) {
          setUser(s.user);
          setPermissions(s.permissions);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      permissions,
      loading,
      can: (perm) => permissions.includes(perm),
      login: async (tenant, email, password) => {
        const r = await doLogin(tenant, email, password);
        setUser(r.user);
        setPermissions(r.permissions);
        return !!r.mustResetPassword;
      },
      logout: async () => {
        await doLogout();
        setUser(null);
        setPermissions([]);
      },
    }),
    [user, permissions, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
