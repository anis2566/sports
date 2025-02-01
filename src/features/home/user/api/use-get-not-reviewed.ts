import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.review.user.notReviewed["$get"]>;

export const useGetNotReviewed = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || undefined;
    const limit = searchParams.get("limit") || undefined;
    const sort = searchParams.get("sort") || undefined;

    const query = useQuery<ResponseType>({
        queryKey: ["user-not-reviewed", page, limit, sort],
        queryFn: async () => {
            const res = await client.api.review.user.notReviewed["$get"]({
                query: { page, limit, sort },
            });
            const parseData = await res.json();
            return { products: parseData.products, totalCount: parseData.totalCount };
        },
    });

    return query;
};
