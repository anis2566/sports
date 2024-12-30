import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.checkout.areas.$get>

export const useGetAreas = (cityId: string | undefined) => {
    const query = useQuery<ResponseType, Error>({
        queryKey: ["areas", cityId],
        queryFn: async () => {
            const res = await client.api.checkout.areas.$get({
                query: {
                    cityId
                }
            });
            const parseData = await res.json();
            return parseData;
        },
    });

    return query;
};
