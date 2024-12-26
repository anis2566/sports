import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.banner.$get>;

export const useGetBanners = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await client.api.banner.$get();
      const parseData = await res.json();
      return { banners: parseData.banners };
    },
  });

  return query;
};
