/**
 * Auth session state shared by every axios client created via `client.ts`.
 *
 * Access token: kept in memory only (XSS-safer than localStorage/sessionStorage).
 * Losing it on a hard page refresh is intentional — AuthContext re-derives it
 * on boot via a silent refresh call (see AuthContext.tsx).
 *
 * Refresh token: in "cookie" mode (default) the backend sets an httpOnly cookie;
 * the frontend never touches it — the browser attaches it automatically via
 * `withCredentials: true`. In "localStorage" mode (fallback) it is stored
 * explicitly — explicit XSS trade-off, use only if backend can't do httpOnly.
 */

export const REFRESH_MODE: 'cookie' | 'localStorage' = 'localStorage';

const REFRESH_TOKEN_KEY = 'auth.refreshToken';

// ── Access token (memory only) ──────────────────────────────────────────────

let _accessToken: string | null = null;

export const getAccessToken = (): string | null => _accessToken;
export const setAccessToken = (t: string | null): void => { _accessToken = t; };
export const clearAccessToken = (): void => { _accessToken = null; };

// ── Refresh token (cookie or localStorage) ──────────────────────────────────

export function getRefreshToken(): string | undefined {
  if (REFRESH_MODE === 'cookie') return undefined; // browser handles it automatically
  return localStorage.getItem(REFRESH_TOKEN_KEY) ?? undefined;
}

export function setRefreshToken(token: string | undefined): void {
  if (REFRESH_MODE === 'cookie') return; // backend Set-Cookie handles it
  if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearRefreshToken(): void {
  if (REFRESH_MODE === 'cookie') return; // cleared by backend on logout
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function clearAllTokens(): void {
  clearAccessToken();
  clearRefreshToken();
}

// ── Tenant (not secret, ok in localStorage) ─────────────────────────────────

export const getTenantSlug = (): string => localStorage.getItem('aegis_tenant') ?? '';
export const setTenantSlug = (slug: string): void => localStorage.setItem('aegis_tenant', slug);
