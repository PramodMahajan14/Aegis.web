import axios from 'axios';
import { attachInterceptors, type InterceptorOptions } from './interceptors';

/**
 * Central point for wiring up a new backend: call createClient(baseURL) and
 * every client gets the same auth/refresh/encryption behavior for free.
 *
 *   export const reportsClient = createClient(import.meta.env.VITE_REPORTS_API_BASE_URL);
 */
export function createClient(baseURL: string, options?: InterceptorOptions) {
  const client = axios.create({
    baseURL,
    withCredentials: true, // send/receive the refresh cookie
  });

  attachInterceptors(client, options);

  return client;
}

// Origin only — API paths already include their own prefix.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5012/api'

/** Primary backend client — used across the app today. */
export const AXIOS = createClient(BASE_URL);
