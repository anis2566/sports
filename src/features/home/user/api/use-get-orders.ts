import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.user.orders[":id"]["$get"]>;

export const useGetOrders = (userId: string) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || undefined;
  const limit = searchParams.get("limit") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const status = searchParams.get("status") || undefined;

  const query = useQuery<ResponseType>({
    queryKey: ["user-orders", page, limit, sort, status],
    queryFn: async () => {
      const res = await client.api.user.orders[":id"]["$get"]({
        param: { id: userId },
        query: { page, limit, sort, status },
      });
      const parseData = await res.json();
      return { orders: parseData.orders, totalCount: parseData.totalCount };
    },
  });

  return query;
};
