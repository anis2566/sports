import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.product.$get>;

export const useGetProducts = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || undefined;
    const limit = searchParams.get("limit") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const q = searchParams.get("query") || undefined;
    const category = searchParams.get("category") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const status = searchParams.get("status") || undefined;

    const query = useQuery<ResponseType>({
        queryKey: ["products", page, limit, sort, q, category, brand, status],
        queryFn: async () => {
            const res = await client.api.product.$get({
                query: { page, limit, sort, query: q, category, brand, status },
            });
            const parseData = await res.json();
            return { products: parseData.products, totalCount: parseData.totalCount };
        },
    });

    return query;
};
