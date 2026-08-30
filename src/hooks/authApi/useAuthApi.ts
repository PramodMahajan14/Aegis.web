import { useMutation, useQuery } from '@tanstack/react-query';
import AuthRepository from '../../api/repositories/AuthRepository';
import { useToast } from '../../Services/ToastServices';
import type { ChangePasswordPayload, LoginPayload, SelectWorkspacePayload } from './authTypes';

/**
 * Query/mutation layer between repositories and consumers.
 *
 * Rules:
 * - Nothing calls AuthRepository directly outside this file.
 * - Session side-effects (token storage, context state) stay in AuthContext.tsx.
 * - These hooks only own the HTTP request lifecycle (loading, error, retry).
 */

// ── Bootstrap (silent refresh on app load) ──────────────────────────────────

/**
 * Runs once on mount to restore a session from the httpOnly refresh cookie.
 * `retry: false` — a missing session is expected for logged-out visitors and
 * must not show a loading spinner while retrying.
 */
export function useBootstrapSessionQuery() {
  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: () => AuthRepository.refresh(),
    retry: false,
    // Never re-run automatically — AuthContext controls the refresh lifecycle
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// ── Step 1: Login ─────────────────────────────────────────────────────────

export function useLoginMutation() {
  const toast = useToast();

  return useMutation({
    mutationFn: (data: LoginPayload) => AuthRepository.login(data),
    onSuccess: () => {
      toast.success('Logged in successfully!');
    },
    onError: (error: unknown) => {
      // Aegis error shape: axios wraps the body in error.response.data
      // Backend envelope: { success: false, message: '...', errors: ... }
      const axiosMsg = (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      const msg = axiosMsg ?? (error as { message?: string })?.message ?? 'Login failed';
      toast.error(msg);
    },
  });
}

// ── Step 2: Fetch workspace list ─────────────────────────────────────────────

/**
 * Fetches the list of workspaces this user belongs to.
 * Only runs when `enabled` is true — caller passes `enabled` based on auth stage.
 */
export function useWorkspacesQuery(enabled: boolean) {
  return useQuery({
    queryKey: ['auth', 'workspaces'],
    // Unwrap the ApiResponse<Workspace[]> envelope so consumers get plain Workspace[]
    queryFn: () => AuthRepository.getWorkspaces().then((res) => res.data),
    enabled,
    retry: 1,
    staleTime: 30_000,
  });
}

// ── Step 3: Select workspace ──────────────────────────────────────────────────

export function useSelectWorkspaceMutation() {
  const toast = useToast();

  return useMutation({
    mutationFn: (data: SelectWorkspacePayload) => AuthRepository.selectWorkspace(data),
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } }; message?: string })
          ?.response?.data?.message ??
        (error as { message?: string })?.message ??
        "Couldn't switch to that workspace. Please try again.";
      toast.error(msg);
    },
  });
}

// ── Logout ────────────────────────────────────────────────────────────────────

export function useLogoutMutation() {
  return useMutation({
    mutationFn: () => AuthRepository.logout(),
  });
}

// ── Change Password ───────────────────────────────────────────────────────────

export function useChangePasswordMutation() {
  const toast = useToast();

  return useMutation({
    mutationFn: (data: ChangePasswordPayload) => AuthRepository.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully.');
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } }; message?: string })
          ?.response?.data?.message ??
        (error as { message?: string })?.message ??
        'Password change failed.';
      toast.error(msg);
    },
  });
}
