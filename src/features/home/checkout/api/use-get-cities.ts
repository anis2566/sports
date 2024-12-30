import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.checkout.cities.$get>;

export const useGetCities = () => {
    const query = useQuery<ResponseType>({
        queryKey: ["cities"],
        queryFn: async () => {
            const res = await client.api.checkout.cities.$get();
            const parseData = await res.json();
            return parseData;
        },
    });

    return query;
};
