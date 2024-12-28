import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.product.reviews.top[":id"]["$get"]>;

export const useGetTopReviews = (id: string) => {
    const query = useQuery<ResponseType>({
        queryKey: ["top-reviews", id],
        queryFn: async () => {
            const res = await client.api.product.reviews.top[":id"]["$get"]({ param: { id } });
            const parseData = await res.json();
            return parseData;
        },
    });

    return query;
};
