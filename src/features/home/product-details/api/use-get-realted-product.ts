import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.product.relatedProducts[":id"]["$get"]>;

export const useGetRelatedProducts = (id: string) => {

    const query = useQuery<ResponseType>({
        queryKey: ["relatedProducts", id],
        queryFn: async () => {
            const res = await client.api.product.relatedProducts[":id"]["$get"]({
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
