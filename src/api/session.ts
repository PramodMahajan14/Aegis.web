/**
 * Auth session state shared by every axios client created via `client.ts`.
 * Access token kept in memory (XSS-safer than localStorage). Tenant slug is not secret.
 */

let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => (accessToken = t);
export const getAccessToken = () => accessToken;

export const getTenantSlug = () => localStorage.getItem('aegis_tenant') ?? '';
export const setTenantSlug = (slug: string) => localStorage.setItem('aegis_tenant', slug);
