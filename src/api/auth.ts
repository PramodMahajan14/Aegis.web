import { AXIOS, setAccessToken, setTenantSlug } from './http';
import type { LoginResult } from './types';

/** Logs in scoped to a tenant, stores the access token + tenant for subsequent calls. */
export async function login(tenantSlug: string, email: string, password: string): Promise<LoginResult> {
  setTenantSlug(tenantSlug);
  const { data } = await AXIOS.post(
    '/auth/login',
    { email, password, tenantSlug, platform: 'web' },
    { headers: { 'X-Tenant': tenantSlug } },
  );
  setAccessToken(data.accessToken);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await AXIOS.post('/auth/logout');
  } finally {
    setAccessToken(null);
  }
}

/** Restore a session on app boot using the refresh cookie. */
export async function bootstrapSession(): Promise<LoginResult | null> {
  try {
    const { data } = await AXIOS.post('/auth/refresh');
    setAccessToken(data.accessToken);
    return data;
  } catch {
    return null;
  }
}

/** Change password (used when mustResetPassword is true or for manual change). */
export async function changePassword(password: string): Promise<void> {
  await AXIOS.post('/auth/change-password', { newPassword: password });
}
