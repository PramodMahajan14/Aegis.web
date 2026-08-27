import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { decryptPayload, encryptPayload, ENCRYPTION_ENABLED } from './crypto';
import { getAccessToken, getTenantSlug, setAccessToken } from './session';

export interface InterceptorOptions {
  /** Attach the Bearer token + X-Tenant header. Default true. */
  requiresAuth?: boolean;
}

/**
 * Attaches auth (token/tenant + transparent one-shot refresh on 401) and
 * payload encryption interceptors to any axios instance. Each call gets its
 * own independent in-flight-refresh state, so multiple clients (e.g. a
 * second backend added via client.ts) don't share/clobber one another's
 * refresh cycle.
 */
export function attachInterceptors(client: AxiosInstance, options: InterceptorOptions = {}): void {
  const { requiresAuth = true } = options;

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (requiresAuth) {
      const accessToken = getAccessToken();
      if (accessToken) config.headers.set('Authorization', `Bearer ${accessToken}`);
      const tenant = getTenantSlug();
      if (tenant) config.headers.set('X-Tenant', tenant);
    }

    if (ENCRYPTION_ENABLED && config.data) {
      config.data = encryptPayload(config.data);
    }

    return config;
  });

  let refreshing: Promise<void> | null = null;

  async function refresh(): Promise<void> {
    if (!refreshing) {
      refreshing = client
        .post('/auth/refresh')
        .then((r) => {
          setAccessToken(r.data.accessToken);
        })
        .finally(() => {
          refreshing = null;
        });
    }
    return refreshing;
  }

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
      const isAuthCall = original?.url?.includes('/auth/');

      if (requiresAuth && status === 401 && original && !original._retry && !isAuthCall) {
        original._retry = true;

        try {
          await refresh();
          return client(original);
        } catch {
          setAccessToken(null);
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    },
  );
}
