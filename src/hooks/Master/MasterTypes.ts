import type { ApiResponse } from "../authApi/authTypes";


export interface JobRole {
    id?: string;
    name: string;
    description: string
}


export type JobeRoles = ApiResponse<JobRole[]>;