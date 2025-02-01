import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.review.top[":productId"]["$get"]>;

export const useGetTopReviews = (id: string) => {
    const query = useQuery<ResponseType>({
        queryKey: ["top-reviews", id],
        queryFn: async () => {
            const res = await client.api.review.top[":productId"]["$get"]({ param: { productId: id } });
            const parseData = await res.json();
            return parseData;
        },
    });

    return query;
};
