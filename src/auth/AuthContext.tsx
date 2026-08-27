import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { setAccessToken, setTenantSlug } from '../api/session';

import {
  useBootstrapSessionQuery,
  useChangePasswordMutation,
  useLoginMutation,
  useLogoutMutation,
} from '../hooks/authApi/useAuthApi';
import type { AuthState, LoginPayload, User } from '../hooks/authApi/authTypes';



const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  // const [tenants, setTenants] = useState<Tenant[]>([]);
  const [requiresTenantSelection, setRequiresTenantSelection] =
    useState(false);

  const [pendingAccessToken, setPendingAccessToken] =
    useState<string | null>(null);

  const sessionQuery = useBootstrapSessionQuery();

  const loginMutation = useLoginMutation();
  // const tenantMutation = useSelectTenantMutation();
  const logoutMutation = useLogoutMutation();
  const changePasswordMutation = useChangePasswordMutation();

  useEffect(() => {
    if (!sessionQuery.data) return;

    setAccessToken(sessionQuery.data.accessToken);
    setUser(sessionQuery.data.user);
    setPermissions(sessionQuery.data.permissions);
  }, [sessionQuery.data]);

  const login = async (data: LoginPayload) => {
    const result = await loginMutation.mutateAsync(data);

    // Temporary token
    setAccessToken(result.accessToken);
    setPendingAccessToken(result.accessToken);

    // const tenantList = await getTenantList();

    // if (tenantList.length === 1) {
    //   await selectTenant(tenantList[0].id);
    //   return;
    // }

    // setTenants(tenantList);
    setRequiresTenantSelection(true);
  };

  // const selectTenant = async (tenantId: string) => {
  //   const result = await tenantMutation.mutateAsync({
  //     tenantId,
  //   });

  //   // Final token
  //   setAccessToken(result.accessToken);

  //   setUser(result.user);
  //   setPermissions(result.permissions);

  //   setTenants([]);
  //   setPendingAccessToken(null);
  //   setRequiresTenantSelection(false);
  // };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      setAccessToken(null);
      setPendingAccessToken(null);
    }

    setUser(null);
    setPermissions([]);
    // setTenants([]);
    setRequiresTenantSelection(false);
  };

  const value = useMemo(
    () => ({
      user,
      permissions,
      // tenants,
      requiresTenantSelection,
      loading: sessionQuery.isPending,

      can: (perm: string) => permissions.includes(perm),

      login,
      // selectTenant,
      logout,

      changePassword: (newPassword: string) =>
        changePasswordMutation.mutateAsync({ newPassword }),
    }),
    [
      user,
      permissions,
      // tenants,
      requiresTenantSelection,
      sessionQuery.isPending,
      changePasswordMutation,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
