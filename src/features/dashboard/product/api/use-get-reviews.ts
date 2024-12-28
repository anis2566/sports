import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";

export const useGetReviews = (id: string) => {
  const searchParams = useSearchParams();
  const cursor = searchParams.get("cursor") || undefined;

  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["reviews", id],
      queryFn: async () => {
        const res = await client.api.product.reviews[":id"]["$get"]({
          param: { id },
          query: { cursor },
        });
        const parseData = await res.json();
        return {
          reviews: parseData.reviews,
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

  const reviews = data?.pages.flatMap((page) => page.reviews) || [];

  return {
    reviews,
    fetchNextPage,
    hasNextPage,
    isFetching,
    status,
  };
};
