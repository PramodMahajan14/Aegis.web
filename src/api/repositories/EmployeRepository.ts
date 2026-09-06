import { api } from '../index';
import type { ApiResponse } from "../../hooks/authApi/authTypes";
import { type Employee } from '../../hooks/Employee/EmployeeTypes';

/**
 * Employee data repository - endpoint definitions only.
 * No tenant/auth context; that's managed by hook/context layer.
 */
const EmployeeRepository = {
    //#region Employee
    GetEmployees: (): Promise<ApiResponse<Employee[]>> => api.get(`/employee/get-employees`),
    GetEmployee: (id: string): Promise<ApiResponse<Employee>> => api.get(`/employee/get-employee/${id}`),
    CreateEmployee: (data: Partial<Employee>): Promise<ApiResponse<Employee>> => api.post(`/employee/create`, data),
    UpdateEmployee: (id: string, data: any): Promise<ApiResponse<Employee>> => api.put(`/employee/update-employee/${id}`, data),
    DeleteEmployee: (id: string): Promise<ApiResponse<void>> => api.delete(`/employee/delete-employee/${id}`)
    //#endregion
}

export default EmployeeRepository;
