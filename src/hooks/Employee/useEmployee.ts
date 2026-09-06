import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EmployeeRepository from '../../api/repositories/EmployeRepository';
import type { Employee } from './EmployeeTypes';
import { Toast2 } from '@blueprintjs/core';
import { useToast } from '../../Services/ToastServices';

export const EMPLOYEE_QUERY_KEYS = {
  all: ['employee'] as const,
  employees: () => [...EMPLOYEE_QUERY_KEYS.all, 'employees'] as const,
  employee: (id: string) => [...EMPLOYEE_QUERY_KEYS.all, 'employee', id] as const,
};

export const useGetEmployees = () => {
  return useQuery({
    queryKey: EMPLOYEE_QUERY_KEYS.employees(),
    queryFn: async () => {
      const response = await EmployeeRepository.GetEmployees();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch employees');
      }
      return response.data;
    },
  });
};

export const useGetEmployee = (id: string) => {
  return useQuery({
    queryKey: EMPLOYEE_QUERY_KEYS.employee(id),
    queryFn: async () => {
      const response = await EmployeeRepository.GetEmployee(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch employee');
      }
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const toast = useToast()

  return useMutation({
    mutationFn: async (data: Partial<Employee>) => {
      const response = await EmployeeRepository.CreateEmployee(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create employee');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.employees() });
    },
    onError: (err) => {
      let message = err?.response.data.message ?? err.name;
      toast.error(message)
    }
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const response = await EmployeeRepository.UpdateEmployee(id, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update employee');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.employees() });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await EmployeeRepository.DeleteEmployee(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete employee');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.employees() });
    },
  });
};
