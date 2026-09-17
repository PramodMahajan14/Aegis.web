import { api } from "..";
import type { Prospects, Prospect } from "../../hooks/Prospect/ProspectType";

/**
 * Prospect data repository - endpoint definitions only.
 * No tenant/auth context; that's managed by hook/context layer.
 */
export const ProspectRepository = {
    GetProspect: (): Promise<Prospects> => api.get('/prospects/list'),
    GetProspectById: (Id: string): Promise<Prospect> => api.get(`/prospects/${Id}`),
    CreateProspect: (data: any) => api.post('/prospects', data),
    UpdateProspect: (data: any) => api.put('/prospects', data),
    DeleteProspect: (data: any) => api.delete('/prospects', data),
}