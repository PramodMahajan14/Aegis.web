import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../Services/ToastServices";
import type { ContactRow, ContactSchema } from "./contacttype";
import type { ServerGridData, ServerGridFetchParams } from "../../components/grid/useServerGrid";
import { ContactRespository } from "../../api/repositories/ContactRepository";

export const Contact_QUERY_KEYS = {
    all: ['contacts'] as const,
    contact: (id: string) => [...Contact_QUERY_KEYS.all, 'contact', id] as const,
    contactByProspect: (prospectId: string, page: number, limit: number) => [...Contact_QUERY_KEYS.all, prospectId, page, limit] as const,
    grid: (prospectId: string, params: ServerGridFetchParams) => [...Contact_QUERY_KEYS.all, 'grid', prospectId, params] as const,
}


export const useCreateContact = (successCall?: () => void) => {
    const toast = useToast()
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (prospect: ContactSchema) => {
            const response = await ContactRespository.createContact(prospect);
            return response;
        },
        onSuccess: (response: any) => {
            queryClient.invalidateQueries({ queryKey: Contact_QUERY_KEYS.all });
            successCall && successCall()
            toast.success(response.message);
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
        }

    });
}

export const useUpdateContact = (successCall?: () => void) => {
    const toast = useToast()
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (contact: ContactSchema) => {
            const response = await ContactRespository.updateContact(contact);
            return response;
        },
        onSuccess: (response: any) => {
            queryClient.invalidateQueries({ queryKey: Contact_QUERY_KEYS.all });
            successCall && successCall()
            toast.success(response.message);
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
        }

    });
}

export const useDeleteContact = (successCall?: () => void) => {
    const toast = useToast()
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await ContactRespository.deleteContact(id);
            return response;
        },
        onSuccess: (response: any) => {
            queryClient.invalidateQueries({ queryKey: Contact_QUERY_KEYS.all });
            successCall && successCall()
            toast.success(response.message);
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
        }

    });
}

export const useGetContactList = (prospectId?: string | undefined, page = 1, limit = 10) => {
    return useQuery({
        queryKey: Contact_QUERY_KEYS.contactByProspect(prospectId || '', page, limit),
        queryFn: async () => {
            const response = await ContactRespository.getContactList(prospectId, page, limit);
            return response;
        }
    })
}

export const useGetContactDeatils = (id: string) => {
    return useQuery({
        queryKey: Contact_QUERY_KEYS.contact(id),
        queryFn: async () => {
            const response = await ContactRespository.getContactDetail(id);
            return response.data;
        },
        enabled: !!id
    })
}

/** Normalise the paged `/contact` response into the shape `<ServerGridView>` expects. */
const toGridData = (response: any, pageSize: number): ServerGridData => {
    // API envelope is `{ success, message, data }`; `data` holds the page.
    const page = response?.success !== undefined ? response.data : response;
    const list = Array.isArray(page)
        ? page
        : (page?.data ?? page?.items ?? page?.rows ?? page?.list ?? page?.records);
    const rows: ContactRow[] = Array.isArray(list) ? list : [];
    const total: number = Number(
        page?.total ?? page?.totalEntities ?? page?.totalCount ?? page?.totalRecords ?? rows.length);
    const totalPages: number = Number(page?.totalPages ?? Math.max(1, Math.ceil(total / pageSize)));
    return { rows, totalPages, totalEntities: total };
}

export const useContactGrid = (params: ServerGridFetchParams, prospectId?: string) => {
    return useQuery({
        queryKey: Contact_QUERY_KEYS.grid(prospectId || '', params),
        queryFn: async () => {
            const response = await ContactRespository.getContactList(
                prospectId, params.pageNumber, params.pageSize, params.searchString);
            return toGridData(response, params.pageSize);
        },
        placeholderData: (prev) => prev,
    })
}
