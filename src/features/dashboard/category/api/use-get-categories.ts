import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.category.$get>;

export const useGetCategories = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || undefined;
    const limit = searchParams.get("limit") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const q = searchParams.get("query") || undefined;
    const status = searchParams.get("status") || undefined;

    const query = useQuery<ResponseType>({
        queryKey: ["category", page, limit, sort, q, status],
        queryFn: async () => {
            const res = await client.api.category.$get({
                query: { page, limit, sort, query: q, status },
            });
            const parseData = await res.json();
            return {
                categories: parseData.categories,
                totalCount: parseData.totalCount,
            };
        },
    });

    return query;
};
