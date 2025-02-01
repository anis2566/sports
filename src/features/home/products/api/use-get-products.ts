import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";

export const useGetProducts = () => {
    const searchParams = useSearchParams();
    const cursor = searchParams.get("cursor") || undefined;
    const query = searchParams.get("query") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const inStock = searchParams.get("inStock") || undefined;
    const priceMin = searchParams.get("priceMin") || undefined;
    const priceMax = searchParams.get("priceMax") || undefined;
    const discountMin = searchParams.get("discountMin") || undefined;
    const discountMax = searchParams.get("discountMax") || undefined;
    const discount = searchParams.get("discount") || undefined;
    const rating = searchParams.get("rating") || undefined;
    const category = searchParams.get("category") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const genre = searchParams.get("genre") || undefined;

    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
        useInfiniteQuery({
            queryKey: ["products-home", query, cursor, sort, inStock, priceMin, priceMax, discountMin, discountMax, discount, rating, category, brand, genre],
            queryFn: async () => {
                const res = await client.api.product.home["$get"]({
                    query: { cursor, query, sort, inStock, priceMin, priceMax, discountMin, discountMax, discount, rating, category, brand, genre },
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
