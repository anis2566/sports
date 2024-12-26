import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.home.banners.$get>;

export const useGetBanners = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["home-banners"],
    queryFn: async () => {
      const res = await client.api.home.banners.$get();
      const parseData = await res.json();
      return {
        banners: parseData.banners,
      };
    },
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return query;
};
