import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.order.$get>;

export const useGetOrders = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || undefined;
    const limit = searchParams.get("limit") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const q = searchParams.get("query") || undefined;
    const phone = searchParams.get("phone") || undefined;
    const status = searchParams.get("status") || undefined;
    const paymentStatus = searchParams.get("paymentStatus") || undefined;

    const query = useQuery<ResponseType>({
        queryKey: ["orders", page, limit, sort, q, phone, status, paymentStatus],
        queryFn: async () => {
            const res = await client.api.order.$get({
                query: { page, limit, sort, query: q, phone, status, paymentStatus },
            });
            const parseData = await res.json();
            return { orders: parseData.orders, totalCount: parseData.totalCount };
        },
    });

    return query;
};
