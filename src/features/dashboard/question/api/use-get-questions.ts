import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.question.$get>;

export const useGetQuestions = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || undefined;
    const limit = searchParams.get("limit") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const q = searchParams.get("query") || undefined;

    const query = useQuery<ResponseType>({
        queryKey: ["admin-questions", page, limit, sort, q],
        queryFn: async () => {
            const res = await client.api.question.$get({
                query: { page, limit, sort, query: q },
            });
            const parseData = await res.json();
            return { questions: parseData.questions, totalCount: parseData.totalCount };
        },
    });

    return query;
};
