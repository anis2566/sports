import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";

export const useGetProductsHome = () => {
    const searchParams = useSearchParams();
    const cursor = searchParams.get("cursor") || undefined;
    const query = searchParams.get("query") || undefined;

    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
        useInfiniteQuery({
            queryKey: ["products-home", query, cursor],
            queryFn: async () => {
                const res = await client.api.product.home["$get"]({
                    query: { cursor, query },
                });
                const parseData = await res.json();
                return {
                    products: parseData.products,
                    nextCursor: parseData.nextCursor,
                };
            },
            initialPageParam: null as string | null,
            getNextPageParam: (firstPage) => firstPage.nextCursor,
            select: (data) => ({
                pages: [...data.pages].reverse(),
                pageParams: [...data.pageParams].reverse(),
            }),
        });

    const products = data?.pages.flatMap((page) => page.products) || [];

    return {
        products,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    };
};
