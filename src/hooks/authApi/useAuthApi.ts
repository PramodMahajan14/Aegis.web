import { useMutation, useQuery } from '@tanstack/react-query';
import AuthRepository from '../../api/repositories/AuthRepository';
import type { ChangePasswordPayload, LoginPayload } from './authTypes';
import { useToast } from '../../Services/ToastServices';

/**
 * Query/mutation layer between repositories and consumers — nothing calls
 * AuthRepository directly outside this file. Session side effects (token
 * storage, context state) stay in the caller (src/auth/AuthContext.tsx),
 * these hooks only own the request lifecycle.
 */

export function useBootstrapSessionQuery() {
  return useQuery({
    queryKey: ['session'],
    queryFn: () => AuthRepository.refresh(),
    retry: false,
  });
}

export function useLoginMutation() {
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      const res = await AuthRepository.login(data);
      return res;
    },
    onSuccess: () => {
      toast.success("Logged in successfully!");
    },
    onError: (error: any) => {
      localStorage.setItem('token', '');
      localStorage.setItem('user', '');
      toast.error(error?.response?.data?.message || error?.message || "Login failed");
    },
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: () => AuthRepository.logout(),
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) => AuthRepository.changePassword(data),
  });
}
