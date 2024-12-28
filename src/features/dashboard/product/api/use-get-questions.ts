import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";

export const useGetQuestions = (id: string) => {
    const searchParams = useSearchParams();
    const cursor = searchParams.get("cursor") || undefined;

    const { data, fetchNextPage, hasNextPage, isFetching, status } =
        useInfiniteQuery({
            queryKey: ["questions", id],
            queryFn: async () => {
                const res = await client.api.product.questions[":id"]["$get"]({
                    param: { id },
                    query: { cursor },
                });
                const parseData = await res.json();
                return {
                    questions: parseData.questions,
                    previousCursor: parseData.previousCursor,
                };
            },
            initialPageParam: null as string | null,
            getNextPageParam: (firstPage) => firstPage.previousCursor,
            select: (data) => ({
                pages: [...data.pages].reverse(),
                pageParams: [...data.pageParams].reverse(),
            }),
        });

    const questions = data?.pages.flatMap((page) => page.questions) || [];

    return {
        questions,
        fetchNextPage,
        hasNextPage,
        isFetching,
        status,
    };
};
