import { api } from '../index';
import { getRefreshToken, REFRESH_MODE } from '../session';
import type {
  ChangePasswordPayload,
  LoginPayload,
  LoginResult,
  RefreshPayload,
  SelectWorkspacePayload,
  SelectWorkspaceResult,
  WorkspaceListResult,
} from '../../hooks/authApi/authTypes';

/**
 * Pure endpoint definitions — one method per endpoint, inputs passed straight
 * through, no reshaping. No token/tenant storage, no component state; those
 * side-effects live in the hook layer (src/hooks/authApi/useAuthApi.ts).
 *
 * All responses are wrapped in the Aegis ApiResponse<T> envelope:
 *   { success, message, data: <payload>, errors, statusCode, dateTime }
 * Access the actual payload via result.data.<field>.
 *
 * Flow:
 *   login()            → POST /auth/login             → ApiResponse<TokenData>
 *   getWorkspaces()    → GET  /auth/get-workspace      → ApiResponse<Workspace[]>
 *   selectWorkspace()  → POST /auth/select-workspace   → ApiResponse<TokenData>
 *   refresh()          → POST /auth/refresh            → ApiResponse<TokenData>
 *   logout()           → POST /auth/logout
 *   changePassword()   → POST /auth/change-password
 */
const AuthRepository = {
  /** Step 1 — POST email + password, get user-level token pair */
  login: (data: LoginPayload): Promise<LoginResult> =>
    api.post<LoginResult>('/auth/login', data),

  /** Step 2 — GET list of workspaces this user belongs to (user-level token) */
  getWorkspaces: (): Promise<WorkspaceListResult> =>
    api.get<WorkspaceListResult>('/auth/get-workspace'),

  /** Step 3 — POST workspaceId, get a new org-scoped token pair back */
  selectWorkspace: (data: SelectWorkspacePayload): Promise<SelectWorkspaceResult> =>
    api.post<SelectWorkspaceResult>('/auth/select-workspace', data),

  /**
   * Silent refresh — called by the interceptor on 401 and by AuthContext on boot.
   *
   * In 'localStorage' mode: the refreshToken must be sent in the request body
   * because the backend does not use httpOnly cookies.
   * In 'cookie' mode: no body needed — the browser sends the cookie automatically.
   */
  refresh: (): Promise<LoginResult> => {
    const body: RefreshPayload | undefined =
      REFRESH_MODE === 'localStorage'
        ? { refreshToken: getRefreshToken() ?? '' }
        : undefined;
    return api.post<LoginResult>('/auth/refresh', body);
  },

  /** Invalidates the refresh token server-side — always call this on logout */
  logout: (): Promise<void> =>
    api.post<void>('/auth/logout'),

  changePassword: (data: ChangePasswordPayload): Promise<void> =>
    api.post<void>('/auth/change-password', data),
};

export default AuthRepository;
