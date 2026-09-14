import type { ApiResponse } from "../authApi/authTypes";


export interface JobRole {
    id?: string;
    name: string;
    description: string
}


export type JobeRoles = ApiResponse<JobRole[]>;

export interface ProjectStage {
    id?: string;
    name: string;
    description: string;
}

export interface Source {
    id?: string;
    name: string;
    code: string;
}

export interface MasterTemperature {
    id?: string;
    name: string;
    code: string;
}

export type ProjectStages = ApiResponse<ProjectStage[]>;
export type Sources = ApiResponse<Source[]>;
export type Temperatures = ApiResponse<MasterTemperature[]>;