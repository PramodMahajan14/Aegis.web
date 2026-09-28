import { api } from "..";
import type { ContactDetails } from "../../hooks/Contact/contacttype";



export const ContactRespository = {
    createContact: (data: any) => api.post('/contact', data),
    getContactDetail: (id: string): Promise<ContactDetails> => api.get(`/contact/${id}`),
    getContactList: (prospectId?: string, page = 1, limit = 10, search = '') => {
        let url = `/contact?page=${page}&limit=${limit}`;
        let params = [];
        if (prospectId) params.push(`prospectId=${prospectId}`);
        if (search) params.push(`search=${encodeURIComponent(search)}`);

        if (params.length > 0) {
            url += '&' + params.join('&')
        }
        return api.get(url);
    }
}