import { api } from '../index';
import type { JobRole, JobeRoles } from "../../hooks/Master/MasterTypes";
import type { ApiResponse } from "../../hooks/authApi/authTypes";


/**
 * Master data repository - endpoint definitions only.
 * No tenant/auth context; that's managed by hook/context layer.
 */
const MasterRepository = {
    GetJobeRoles: (): Promise<JobeRoles> => api.get(`/master/get-joberoles`),
    CreateJobeRole: (data: Partial<JobRole>): Promise<ApiResponse<JobRole>> => api.post(`/master/create-joberole`, data)
}

export default MasterRepository
