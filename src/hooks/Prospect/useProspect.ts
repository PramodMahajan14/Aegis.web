import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ProspectRepository } from "../../api/repositories/ProspectRepository";
import type { Prospect, ProspectPayload } from "./ProspectType";
import { useToast } from "../../Services/ToastServices";

export const Prospect_QUERY_KEYS = {
    all: ['prospect'] as const,
    prospects: () => [...Prospect_QUERY_KEYS.all, 'prospects'] as const,
    prospect: (id: string) => [...Prospect_QUERY_KEYS.all, 'prospect', id] as const,
};

export const useProspectsList = () => {
    return useQuery({
        queryKey: Prospect_QUERY_KEYS.prospects(),
        queryFn: async () => {
            const response = await ProspectRepository.GetProspect();
            return response;
        },
        staleTime: 5 * 60 * 1000,

    });
}


export const useProspect = (id: string) => {
    return useQuery({
        queryKey: Prospect_QUERY_KEYS.prospect(id),
        queryFn: async () => {
            const response = await ProspectRepository.GetProspectById(id);
            return response.data;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
    });
}

export const useCreateProspect = (successCall?: () => void) => {
    const toast = useToast()
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (prospect: ProspectPayload) => {
            const response = await ProspectRepository.CreateProspect(prospect);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: Prospect_QUERY_KEYS.prospects() });
            successCall && successCall()
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
        }

    });
}
