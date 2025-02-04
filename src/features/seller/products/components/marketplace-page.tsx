"use client"

import { Loader2 } from "lucide-react";

import { useGetProducts } from "@/features/home/products/api/use-get-products"

import { Search } from "./search"
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";

export const MarketplacePage = () => {
    const { products, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useGetProducts();
    return (
        <div className="space-y-4 w-full">
            <Search />

            <div className="md:pl-4 space-y-4 w-full">
                <p className="text-md text-gray-500">{products.length} books found</p>
                {status === "pending" ? (
                    <div className="w-full grid gap-4 md:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i}>
                                <ProductCardSkeleton />
                            </div>
                        ))}
                    </div>
                ) : (
                    <InfiniteScrollContainer
                        className="w-full max-w-6xl grid gap-x-2 md:gap-x-4 gap-y-4 grid-cols-2 md:grid-cols-4"
                        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
                    >
                        {products.map((product, i) => (
                            <ProductCard key={i} product={product} priceType="seller" />
                        ))}
                        {isFetchingNextPage && (
                            <div className="flex justify-center">
                                <Loader2 className="mx-auto my-3 animate-spin" />
                            </div>
                        )}
                    </InfiniteScrollContainer>
                )}
            </div>
        </div>
    )
}