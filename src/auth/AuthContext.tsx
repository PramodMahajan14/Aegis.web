import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AXIOS } from '../api/client';
import {
  bootstrapCsrf,
  registerAuthFailureHandler,
  registerRefreshFn,
} from '../api/interceptors';
import {
  clearAllTokens,
  setAccessToken,
  setRefreshToken,
} from '../api/session';
import {
  useChangePasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useSelectWorkspaceMutation,
} from '../hooks/authApi/useAuthApi';
import {
  AuthStage,
  stageAtLeast,
  type AuthState,
  type AuthStageType,
  type LoginPayload,
  type User,
  type Workspace,
} from '../hooks/authApi/authTypes';
import AuthRepository from '../api/repositories/AuthRepository';

export { AuthStage, stageAtLeast };

// ── JWT decode (display-only) ─────────────────────────────────────────────────
// Never use this for routing/authorization decisions — stage state is the
// source of truth. Only used to extract user ID and email for display.
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

function userFromToken(token: string): User | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  const sub = payload['sub'];
  const email = payload['email'];
  if (!sub && !email) return null;
  return {
    id: String(sub ?? ''),
    email: String(email ?? ''),
    name: String(email ?? ''),       // display name falls back to email
    role: String(payload['role'] ?? ''),
  };
}

// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<AuthStageType>(AuthStage.UNAUTHENTICATED);
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<{ organizationId: string } | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [booting, setBooting] = useState(true);

  // Prevent React Strict Mode's double-invoke from firing two refresh calls.
  // With refresh token rotation the first call (cancelled by cleanup) would
  // consume the token, making the second Strict Mode run fail with 401.
  const _bootFired = useRef(false);

  // ── Mutations ─────────────────────────────────────────────────────────────

  const loginMutation = useLoginMutation();
  const selectWorkspaceMutation = useSelectWorkspaceMutation();
  const logoutMutation = useLogoutMutation();
  const changePasswordMutation = useChangePasswordMutation();

  // ── applyTokens ───────────────────────────────────────────────────────────
  //
  // Single helper that transitions auth state. The nextStage is ALWAYS passed
  // explicitly by the caller (login/selectWorkspace/refresh-on-boot) — we never
  // infer it from the JWT so a stale cached token can't spoof a higher stage.

  const applyTokens = useCallback(
    (
      accessToken: string,
      nextStage: AuthStageType,
      opts?: {
        refreshToken?: string;
        organizationId?: string;
      },
    ) => {
      setAccessToken(accessToken);
      if (opts?.refreshToken) setRefreshToken(opts.refreshToken);

      // Decode user info from JWT for display only
      const decoded = userFromToken(accessToken);
      setUser(decoded);

      if (opts?.organizationId) {
        setOrganization({ organizationId: opts.organizationId });
      } else if (nextStage !== AuthStage.WORKSPACE_SCOPED) {
        setOrganization(null);
      }

      setStage(nextStage);
    },
    [],
  );

  // ── Login ─────────────────────────────────────────────────────────────────

  const login = useCallback(
    async (data: LoginPayload): Promise<void> => {
      // result is ApiResponse<TokenData>: { success, message, data: { accessToken, refreshToken } }
      const result = await loginMutation.mutateAsync(data);

      applyTokens(result.data.accessToken, AuthStage.AUTHENTICATED_NO_WORKSPACE, {
        refreshToken: result.data.refreshToken,
      });
    },
    [loginMutation, applyTokens],
  );

  // ── Select Workspace ──────────────────────────────────────────────────────

  const selectWorkspace = useCallback(
    async (workspaceId: string): Promise<void> => {
      // result is ApiResponse<TokenData>
      const result = await selectWorkspaceMutation.mutateAsync({ workspaceId });

      applyTokens(result.data.accessToken, AuthStage.WORKSPACE_SCOPED, {
        refreshToken: result.data.refreshToken,
        organizationId: workspaceId, // use the ID we sent — never decode from JWT
      });
    },
    [selectWorkspaceMutation, applyTokens],
  );

  // ── Logout ────────────────────────────────────────────────────────────────

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // best-effort — clear client state regardless
    }
    clearAllTokens();
    setUser(null);
    setOrganization(null);
    setWorkspaces([]);
    setPermissions([]);
    setStage(AuthStage.UNAUTHENTICATED);
  }, [logoutMutation]);

  // ── Change Password ───────────────────────────────────────────────────────

  const changePassword = useCallback(
    (newPassword: string): Promise<void> =>
      changePasswordMutation.mutateAsync({ newPassword }),
    [changePasswordMutation],
  );

  // ── Wire interceptor callbacks ────────────────────────────────────────────
  //
  // registerRefreshFn: called by the axios interceptor on 401.
  //   Must return the new access token as a string.
  //   AuthRepository.refresh() sends the refreshToken in the body automatically
  //   (localStorage mode) — see AuthRepository.ts.
  //
  // registerAuthFailureHandler: called when refresh itself fails → force logout.

  useEffect(() => {
    registerRefreshFn(async () => {
      // result.data.accessToken — the nested envelope format
      const result = await AuthRepository.refresh();
      const { accessToken, refreshToken } = result.data;

      setAccessToken(accessToken);
      if (refreshToken) setRefreshToken(refreshToken);

      // Update user display info from the new token
      const decoded = userFromToken(accessToken);
      setUser(decoded);

      return accessToken; // interceptor uses this to patch the Authorization header
    });

    registerAuthFailureHandler(() => {
      clearAllTokens();
      setUser(null);
      setOrganization(null);
      setWorkspaces([]);
      setPermissions([]);
      setStage(AuthStage.UNAUTHENTICATED);
    });
  }, []); // one-time registration

  // ── Boot: attempt silent refresh to restore session ───────────────────────
  //
  // On a hard page reload the access token (memory-only) is lost. We attempt
  // a silent refresh using the stored refresh token (localStorage mode) to
  // restore the session without forcing a fresh login.

  useEffect(() => {
    // Guard against React Strict Mode double-invoke. Without this, the first
    // refresh call consumes the rotation token and the second fails with 401.
    if (_bootFired.current) return;
    _bootFired.current = true;

    (async () => {
      try {
        // CSRF bootstrap — best-effort, silently ignored if endpoint doesn't exist
        await bootstrapCsrf(AXIOS);

        const result = await AuthRepository.refresh();
        const { accessToken, refreshToken } = result.data;

        // After a page reload we restore the user-level session.
        // If your backend includes organizationId in the refresh response,
        // check it here and set WORKSPACE_SCOPED so the user skips workspace selection.
        applyTokens(accessToken, AuthStage.AUTHENTICATED_NO_WORKSPACE, {
          refreshToken,
        });
      } catch {
        // Refresh failed (expired/invalid token or no session at all).
        // Clear stale tokens and remain UNAUTHENTICATED — Guard will redirect to /login.
        clearAllTokens();
        setUser(null);
        setOrganization(null);
        setWorkspaces([]);
        setPermissions([]);
        setStage(AuthStage.UNAUTHENTICATED);
      } finally {
        setBooting(false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Context value ─────────────────────────────────────────────────────────

  const value = useMemo<AuthState>(
    () => ({
      stage,
      user,
      organization,
      workspaces,
      permissions,
      booting,

      can: (permission: string) => permissions.includes(permission),

      login,
      selectWorkspace,
      logout,
      changePassword,
    }),
    [
      stage,
      user,
      organization,
      workspaces,
      permissions,
      booting,
      login,
      selectWorkspace,
      logout,
      changePassword,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
