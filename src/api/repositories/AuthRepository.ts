import { api } from '../index';
import type { ChangePasswordPayload, LoginPayload, LoginResult } from '../../hooks/authApi/authTypes';


/**
 * Pure endpoint definitions — one method per endpoint, takes the request
 * body as-is and passes it straight through, no reshaping. No token/tenant
 * storage, no component state; session side effects live in the hook that
 * calls these (src/hooks/useAuthApi.ts).
 */
const AuthRepository = {
  login: (data: LoginPayload) =>
    api.post<LoginResult>('/auth/login', data),

  refresh: () => api.post<LoginResult>('/auth/refresh'),

  logout: () => api.post<void>('/auth/logout'),

  changePassword: (data: ChangePasswordPayload) => api.post<void>('/auth/change-password', data),
};

export default AuthRepository;
