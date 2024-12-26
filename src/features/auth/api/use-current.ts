import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.auth.current.$get>;

export const useCurrent = () => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ["current"],
    queryFn: async () => {
      const res = await client.api.auth.current.$get();
      const parsed = await res.json();
      return { user: parsed.user };
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return query;
};
