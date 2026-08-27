import type { AxiosRequestConfig } from 'axios';
import { AXIOS } from './client';

/**
 * Generic request wrapper used by every repository. Centralizing it here
 * means repositories never touch axios directly — swapping the underlying
 * client (or adding a second one for another backend, see client.ts) never
 * requires editing repository files.
 */
async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const { data } = await AXIOS.request<T>(config);
  return data;
}

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    request<T>({ ...config, method: 'get', url }),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    request<T>({ ...config, method: 'post', url, data }),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    request<T>({ ...config, method: 'put', url, data }),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    request<T>({ ...config, method: 'patch', url, data }),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    request<T>({ ...config, method: 'delete', url }),
};
