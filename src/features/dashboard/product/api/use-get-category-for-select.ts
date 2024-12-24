import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
    typeof client.api.product.categoryForSelect.$get
>;

export const useGetCategoryForSelect = () => {
    const searchParams = useSearchParams()
    const categoryQuery = searchParams.get("categoryQuery") || undefined

    const query = useQuery<ResponseType>({
        queryKey: ["categoryForSelect", categoryQuery],
        queryFn: async () => {
            const res = await client.api.product.categoryForSelect.$get({
                query: {
                    query: categoryQuery,
                },
            });
            const parseData = await res.json();
            return parseData;
        },
    });

    return query;
};