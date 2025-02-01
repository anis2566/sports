import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.product.home.recent.$get>;

export const useGetRecentlyAddedProducts = () => {
    const query = useQuery<ResponseType>({
        queryKey: ["home-recently-added-products"],
        queryFn: async () => {
            const res = await client.api.product.home.recent.$get();
            const parseData = await res.json();
            return {
                products: parseData.products,
            };
        },
        staleTime: 1000 * 60 * 60 * 24,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return query;
};
