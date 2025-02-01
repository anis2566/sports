import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
    typeof client.api.brand.forSelect.$get
>;

export const useGetBrandForSelect = () => {
    const searchParams = useSearchParams()
    const brandQuery = searchParams.get("brandQuery") || undefined

    const query = useQuery<ResponseType>({
        queryKey: ["brandForSelect", brandQuery],
        queryFn: async () => {
            const res = await client.api.brand.forSelect.$get({
                query: {
                    query: brandQuery,
                },
            });
            const parseData = await res.json();
            return parseData;
        },
    });

    return query;
};