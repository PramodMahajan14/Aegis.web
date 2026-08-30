// ── Auth Stage State Machine ─────────────────────────────────────────────────
//
// Three explicit trust levels. Never infer stage from a decoded JWT payload —
// that's the main pitfall this design avoids (see AUTH_FLOW.md §7).

export const AuthStage = {
  UNAUTHENTICATED: 'unauthenticated',
  AUTHENTICATED_NO_WORKSPACE: 'authenticated_no_workspace',
  WORKSPACE_SCOPED: 'workspace_scoped',
} as const;

export type AuthStageType = (typeof AuthStage)[keyof typeof AuthStage];

// Order matters — used for minStage comparisons in Guard
const STAGE_ORDER: AuthStageType[] = [
  AuthStage.UNAUTHENTICATED,
  AuthStage.AUTHENTICATED_NO_WORKSPACE,
  AuthStage.WORKSPACE_SCOPED,
];

export function stageAtLeast(current: AuthStageType, required: AuthStageType): boolean {
  return STAGE_ORDER.indexOf(current) >= STAGE_ORDER.indexOf(required);
}

// ── Standard API envelope ────────────────────────────────────────────────────
//
// Every response from the Aegis backend is wrapped in this shape:
// { success, message, data: <T>, errors, statusCode, dateTime }
// Our api() wrapper extracts the HTTP response body, so callers receive this
// full envelope. Access the payload via response.data.<field>.

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
  statusCode: number;
  dateTime: string;
}

// ── Domain types ─────────────────────────────────────────────────────────────

/**
 * User decoded for display purposes only.
 * Source: decoded from the JWT payload (sub, email) on login/refresh.
 * Never used for routing decisions — stage is used instead.
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface Workspace {
  id: string;
  name: string;
  role: string;
}

// ── Request payloads ─────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  newPassword: string;
}

export interface SelectWorkspacePayload {
  workspaceId: string;
}

export interface RefreshPayload {
  refreshToken: string;
}

// ── Token data (inside the envelope .data field) ─────────────────────────────

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
}

// ── API response shapes ──────────────────────────────────────────────────────

/**
 * Returned by POST /auth/login and POST /auth/refresh.
 * Full envelope: { success, message, data: { accessToken, refreshToken? } }
 * Access tokens via result.data.accessToken
 */
export type LoginResult = ApiResponse<TokenData>;

/**
 * Returned by POST /auth/select-workspace.
 * Full envelope: { success, message, data: { accessToken, refreshToken? } }
 */
export type SelectWorkspaceResult = ApiResponse<TokenData>;

/**
 * Returned by GET /auth/get-workspace.
 * Full envelope: { success, message, data: Workspace[] }
 */
export type WorkspaceListResult = ApiResponse<Workspace[]>;

// ── Context surface (what consumers see via useAuth()) ───────────────────────

export interface AuthState {
  stage: AuthStageType;
  user: User | null;
  organization: { organizationId: string } | null;
  workspaces: Workspace[];
  permissions: string[];
  booting: boolean; // true while we attempt silent refresh on load

  /** Derived helpers */
  can: (permission: string) => boolean;

  /** Auth actions */
  login: (data: LoginPayload) => Promise<void>;
  selectWorkspace: (workspaceId: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
}