import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MasterRepository from '../../api/repositories/MasterRepository';
import type { JobRole } from './MasterTypes';

export const MASTER_QUERY_KEYS = {
  all: ['master'] as const,
  jobRoles: () => [...MASTER_QUERY_KEYS.all, 'jobRoles'] as const,
  jobRole: (id: string) => [...MASTER_QUERY_KEYS.all, 'jobRole', id] as const,
};

export const useGetJobeRoles = () => {
  return useQuery({
    queryKey: MASTER_QUERY_KEYS.jobRoles(),
    queryFn: async () => {
      const response = await MasterRepository.GetJobeRoles();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch job roles');
      }
      return response.data;
    },
  });
};

export const useGetJobeRole = (id: string) => {
  return useQuery({
    queryKey: MASTER_QUERY_KEYS.jobRole(id),
    queryFn: async () => {
      const response = await MasterRepository.GetJobeRole(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch job role');
      }
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateJobeRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<JobRole>) => {
      const response = await MasterRepository.CreateJobeRole(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create job role');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_QUERY_KEYS.jobRoles() });
    },
  });
};

export const useUpdateJobeRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const response = await MasterRepository.UpdateJobeRole(id, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update job role');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_QUERY_KEYS.jobRoles() });
    },
  });
};

export const useDeleteJobeRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await MasterRepository.DeleteJobeRole(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete job role');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MASTER_QUERY_KEYS.jobRoles() });
    },
  });
};
