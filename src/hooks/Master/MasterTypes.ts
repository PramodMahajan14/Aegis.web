import type { ApiResponse } from "../authApi/authTypes";


export interface JobRole {
    Id?: string;
    name: string;
    description: string
}


export type JobeRoles = ApiResponse<JobRole[]>;