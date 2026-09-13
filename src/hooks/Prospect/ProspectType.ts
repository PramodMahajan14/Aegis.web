import type { ApiResponse } from "../authApi/authTypes";


export interface basicNext {
    id: string;
    code: string;
    name: string
}

interface NextAction {
    title: string;
    date: string;
}

export type ProspectSatus = basicNext
export type ProspectSource = basicNext
export type IndustryType = basicNext
export type SubIndustryType = basicNext
export type EmployeeSize = basicNext
export type CurrencyType = basicNext
export type ProspectTemperature = basicNext


interface _Prospect {
    id: string,
    name: string,
    businessName: string,
    prospectNo: string,
    estimatedValue: number,
    location: string;
    status: ProspectSatus,
    temperature: ProspectTemperature,
    nextAction?: NextAction;
}

export type Prospects = ApiResponse<_Prospect[]>;
export type Prospect = ApiResponse<_Prospect>;
