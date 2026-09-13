import { useQuery } from "@tanstack/react-query"
import { ProspectRepository } from "../../api/repositories/ProspectRepository";

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