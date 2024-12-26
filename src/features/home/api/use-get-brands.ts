import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.home.brands.$get>;

export const useGetBrands = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["home-brands"],
    queryFn: async () => {
      const res = await client.api.home.brands.$get();
      const parseData = await res.json();
      return {
        brands: parseData.brands,
      };
    },
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return query;
};
