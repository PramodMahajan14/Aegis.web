import { api } from '../index';
import type { JobRole, JobeRoles } from "../../hooks/Master/MasterTypes";
import type { ApiResponse } from "../../hooks/authApi/authTypes";


/**
 * Master data repository - endpoint definitions only.
 * No tenant/auth context; that's managed by hook/context layer.
 */
const MasterRepository = {
    //#region  Job Role
    GetJobeRoles: (): Promise<JobeRoles> => api.get(`/master/get-jobroles`),
    GetJobeRole: (id: string): Promise<ApiResponse<JobRole>> => api.get(`/master/get-jobrole/${id}`),
    CreateJobeRole: (data: Partial<JobRole>): Promise<ApiResponse<JobRole>> => api.post(`/master/create-jobrole`, data),
    UpdateJobeRole: (id: string, data: any): Promise<ApiResponse<JobRole>> => api.put(`/master/update-jobrole/${id}`, data),
    DeleteJobeRole: (id: string): Promise<ApiResponse<void>> => api.delete(`/master/delete-jobrole/${id}`)
    //#endregion

    //#region Application Role

}

export default MasterRepository
