import type { AxiosRequestConfig } from 'axios';
import { AXIOS } from './client';

/**
 * Re-exports the primary backend client for existing call sites. See
 * client.ts (client factory + how to add a second backend), interceptors.ts
 * (auth/refresh/encryption wiring shared by every client), session.ts
 * (token/tenant state), and crypto.ts (request/response encryption hook).
 */
export { AXIOS };
export { getAccessToken, setAccessToken, getTenantSlug, setTenantSlug } from './session';

export const customInstance = <T,>(config: AxiosRequestConfig): Promise<T> => {
  return AXIOS.request<T>(config).then(({ data }) => data);
};

export default customInstance;
