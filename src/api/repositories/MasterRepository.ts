import { api } from '../index';
import type { JobRole, JobeRoles, ProjectStage, ProjectStages, Source, Sources, MasterTemperature, Temperatures } from "../../hooks/Master/MasterTypes";
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
    DeleteJobeRole: (id: string): Promise<ApiResponse<void>> => api.delete(`/master/delete-jobrole/${id}`),
    //#endregion

    //#region Project Stage
    GetProjectStages: (): Promise<ProjectStages> => api.get(`/master/project-stages`),
    CreateProjectStage: (data: Partial<ProjectStage>): Promise<ApiResponse<ProjectStage>> => api.post(`/master/create-project-stage`, data),
    UpdateProjectStage: (id: string, data: Partial<ProjectStage>): Promise<ApiResponse<ProjectStage>> => api.put(`/master/project-stage-update/${id}`, data),
    DeleteProjectStage: (id: string): Promise<ApiResponse<void>> => api.delete(`/master/project-stage-delete/${id}`),
    //#endregion

    //#region Source
    GetSources: (): Promise<Sources> => api.get(`/master/sources`),
    // GetSource: (id: string): Promise<ApiResponse<Source>> => api.get(`/master/source/${id}`),
    // CreateSource: (data: Partial<Source>): Promise<ApiResponse<Source>> => api.post(`/master/create-source`, data),
    // UpdateSource: (id: string, data: any): Promise<ApiResponse<Source>> => api.put(`/master/update-source/${id}`, data),
    // DeleteSource: (id: string): Promise<ApiResponse<void>> => api.delete(`/master/delete-source/${id}`),
    //#endregion

    //#region Temperature
    GetTemperatures: (): Promise<Temperatures> => api.get(`/master/temperatures`),
    //#endregion

}




export default MasterRepository
