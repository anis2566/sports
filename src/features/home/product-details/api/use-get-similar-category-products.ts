import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.product.similarCategoryProducts[":id"]["$get"]>;

export const useGetSimilarCategoryProducts = (id: string) => {

    const query = useQuery<ResponseType>({
        queryKey: ["similarCategoryProducts", id],
        queryFn: async () => {
            const res = await client.api.product.similarCategoryProducts[":id"]["$get"]({
                param: { id },
            });
            const parseData = await res.json();
            return parseData;
        },
        staleTime: 1000 * 60 * 60 * 24,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return query;
};
