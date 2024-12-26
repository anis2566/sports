import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.home.categories.$get>;

export const useGetCategories = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["home-categories"],
    queryFn: async () => {
      const res = await client.api.home.categories.$get();
      const parseData = await res.json();
      return {
        categories: parseData.categories,
      };
    },
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return query;
};
