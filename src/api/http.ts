import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

/**
 * Single axios instance used across the app. Handles: base URL, Bearer
 * access token, X-Tenant header, and transparent one-shot refresh on 401
 * (refresh token lives in an httpOnly cookie on web).
 */

// Origin only — API paths already include their own prefix.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

// Access token kept in memory (XSS-safer than localStorage). Tenant slug is not secret.
let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => (accessToken = t);
export const getAccessToken = () => accessToken;

export const getTenantSlug = () => localStorage.getItem('aegis_tenant') ?? '';
export const setTenantSlug = (slug: string) => localStorage.setItem('aegis_tenant', slug);

export const AXIOS = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send/receive the refresh cookie
});

AXIOS.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) config.headers.set('Authorization', `Bearer ${accessToken}`);
  const tenant = getTenantSlug();
  if (tenant) config.headers.set('X-Tenant', tenant);
  return config;
});

// ── transparent refresh ────────────────────────────────────────────
let refreshing: Promise<void> | null = null;

async function refresh(): Promise<void> {
  if (!refreshing) {
    refreshing = AXIOS.post('/auth/refresh')
      .then((r) => {
        setAccessToken(r.data.accessToken);
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

AXIOS.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;
    const isAuthCall = original?.url?.includes('/auth/');

    if (status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;

      try {
        await refresh();
        return AXIOS(original);
      } catch {
        setAccessToken(null);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export const customInstance = <T,>(config: AxiosRequestConfig): Promise<T> => {
  return AXIOS.request<T>(config).then(({ data }) => data);
};

export default customInstance;
