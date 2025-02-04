import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.seller.request.$get>;

export const useGetSellerRequest = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || undefined;
    const limit = searchParams.get("limit") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const q = searchParams.get("query") || undefined;

    const query = useQuery<ResponseType>({
        queryKey: ["seller-requests", page, limit, sort, q],
        queryFn: async () => {
            const res = await client.api.seller.request.$get({
                query: { page, limit, sort, query: q },
            });
            const parseData = await res.json();
            return {
                sellers: parseData.sellers,
                totalCount: parseData.totalCount,
            };
        },
    });

    return query;
};
