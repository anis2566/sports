import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.product.stat.$get>;

export const useGetProductStat = () => {
    const query = useQuery<ResponseType>({
        queryKey: ["product-stat"],
        queryFn: async () => {
            const res = await client.api.product.stat.$get();
            const parseData = await res.json();
            return parseData;
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return query;
};
