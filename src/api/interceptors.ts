import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { decryptPayload, encryptPayload, ENCRYPTION_ENABLED } from './crypto';
import {
  clearAllTokens,
  getAccessToken,
  getTenantSlug,
  REFRESH_MODE,
  setAccessToken,
  setRefreshToken,
} from './session';

export interface InterceptorOptions {
  /** Attach the Bearer token + X-Tenant header. Default true. */
  requiresAuth?: boolean;
}

// ── CSRF (double-submit cookie, ASP.NET Core IAntiforgery defaults) ─────────
//
// The XSRF-TOKEN cookie is deliberately NOT httpOnly — the frontend reads it
// and echoes it back as X-CSRF-TOKEN on every state-changing request.
// bootstrapCsrf() fetches the cookie once on app boot; after that, getCsrfCookie()
// reads it fresh on every request so token rotation works transparently.

const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const CSRF_HEADER_NAME = 'X-CSRF-TOKEN';

function getCsrfCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${CSRF_COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Call once on app boot to ensure the XSRF-TOKEN cookie is set by the backend.
 * Errors are swallowed — if the backend doesn't implement /auth/csrf yet, this
 * is a no-op. The CSRF header will simply not be sent until the cookie exists.
 */
export async function bootstrapCsrf(client: AxiosInstance): Promise<void> {
  try {
    await client.get('/auth/csrf');
  } catch {
    // best-effort — not all backends implement this endpoint
  }
}

// ── Auth failure / refresh callbacks (set by AuthContext) ───────────────────
//
// Using module-level callbacks instead of direct imports to break the circular
// dependency chain: AuthContext → interceptors → AuthContext.

let _onAuthFailure: () => void = () => {};
let _refreshFn: (() => Promise<string>) | null = null;

/** Called by AuthContext to register the logout handler. */
export function registerAuthFailureHandler(fn: () => void): void {
  _onAuthFailure = fn;
}

/**
 * Called by AuthContext to register a refresh function. Injected lazily to
 * avoid circular imports (same pattern as the reference httpClient.js).
 */
export function registerRefreshFn(fn: () => Promise<string>): void {
  _refreshFn = fn;
}

// ── Interceptor attachment ───────────────────────────────────────────────────

/**
 * Attaches auth (Bearer token + X-Tenant + CSRF header) and transparent
 * one-shot refresh-on-401 interceptors to any axios instance.
 *
 * Each client gets its own `refreshPromise` so multiple clients don't
 * clobber one another's in-flight refresh.
 */
export function attachInterceptors(client: AxiosInstance, options: InterceptorOptions = {}): void {
  const { requiresAuth = true } = options;

  // ── Request: attach access token, tenant slug, and CSRF header ─────────
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (requiresAuth) {
      const token = getAccessToken();
      if (token) config.headers.set('Authorization', `Bearer ${token}`);

      const tenant = getTenantSlug();
      if (tenant) config.headers.set('X-Tenant', tenant);
    }

    // Attach CSRF token on all state-changing methods
    const method = (config.method ?? 'get').toUpperCase();
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      const csrf = getCsrfCookie();
      if (csrf) config.headers.set(CSRF_HEADER_NAME, csrf);
    }

    if (ENCRYPTION_ENABLED && config.data) {
      config.data = encryptPayload(config.data);
    }

    return config;
  });

  // ── Response: decrypt + shared refresh-on-401 ──────────────────────────
  let refreshPromise: Promise<string> | null = null;

  client.interceptors.response.use(
    (response) => {
      if (ENCRYPTION_ENABLED && response.data) {
        response.data = decryptPayload(response.data);
      }
      return response;
    },
    async (error: AxiosError) => {
      const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
      const status = error.response?.status;

      // Only attempt refresh for 401s, and only once per original request
      if (!requiresAuth || status !== 401 || !original || original._retry || !_refreshFn) {
        return Promise.reject(error);
      }

      // Don't attempt to refresh the refresh call itself (infinite loop guard).
      // Just reject — the caller (_refreshFn's promise chain or the boot effect)
      // is responsible for calling _onAuthFailure() if needed.
      if (original.url?.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      original._retry = true;

      try {
        // Share a single in-flight refresh across all concurrent 401s
        if (!refreshPromise) {
          refreshPromise = _refreshFn().finally(() => {
            refreshPromise = null;
          });
        }
        const newToken = await refreshPromise;

        // Update the header and retry the original request exactly once
        if (original.headers) {
          (original.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
        }
        return client(original);
      } catch (refreshError) {
        _onAuthFailure(); // refresh itself failed → force logout
        return Promise.reject(refreshError);
      }
    },
  );
}

// Re-export for http.ts compatibility
export { getAccessToken, setAccessToken, clearAllTokens, setRefreshToken, REFRESH_MODE };
