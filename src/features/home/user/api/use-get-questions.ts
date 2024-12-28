import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.user.questions["$get"]>;

export const useGetQuestions = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || undefined;
    const limit = searchParams.get("limit") || undefined;
    const sort = searchParams.get("sort") || undefined;

    const query = useQuery<ResponseType>({
        queryKey: ["user-questions", page, limit, sort],
        queryFn: async () => {
            const res = await client.api.user.questions["$get"]({
                query: { page, limit, sort },
            });
            const parseData = await res.json();
            return { questions: parseData.questions, totalCount: parseData.totalCount };
        },
    });

    return query;
};
