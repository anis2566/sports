import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.checkout.zones.$get>

export const useGetZones = (areaId: string | undefined) => {
    const query = useQuery<ResponseType, Error>({
        queryKey: ["zones", areaId],
        queryFn: async () => {
            const res = await client.api.checkout.zones.$get({
                query: {
                    areaId
                }
            });
            const parseData = await res.json();
            return parseData;
        },
    });

    return query;
};
