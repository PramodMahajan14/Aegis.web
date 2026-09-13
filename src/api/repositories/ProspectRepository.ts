import { api } from "..";
import type { Prospects } from "../../hooks/Prospect/ProspectType";

/**
 * Prospect data repository - endpoint definitions only.
 * No tenant/auth context; that's managed by hook/context layer.
 */
export const ProspectRepository = {
    GetProspect: (): Promise<Prospects> => api.get('/prospects'),
    GetProspectById: (data: any) => api.get('/prospects', data),
    CreateProspect: (data: any) => api.post('/prospects', data),
    UpdateProspect: (data: any) => api.put('/prospects', data),
    DeleteProspect: (data: any) => api.delete('/prospects', data),
}