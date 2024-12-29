"use client"

import { FilterIcon, Loader2, SortAscIcon } from "lucide-react";

import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import { Button } from "@/components/ui/button";

import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import { useGetProductsHome } from "@/features/dashboard/product/api/use-get-products-home";
import { Filter } from "./filter";
import { FilterDrawer } from "./filter-drawer";
import { SortDrawer } from "./sort-drawer";

export const ProductPage = () => {
    const { products, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useGetProductsHome();

    return (
        <div className="px-0 mt-4 relative min-h-screen">
            <div className="flex gap-x-3 ">
                <div className="hidden md:flex flex-col w-72 flex-shrink-0 border-r border-gray-200 absolute top-0 left-0 h-full">
                    <Filter />
                </div>
                <div className="md:ml-72 md:pl-4 space-y-4 w-full">
                    <p className="text-md text-gray-500">{products.length} books found</p>
                    {status === "pending" ? (
                        <div className="grid gap-4 md:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i}>
                                    <ProductCardSkeleton />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <InfiniteScrollContainer
                            className="grid gap-x-2 md:gap-x-4 gap-y-4 grid-cols-2 md:grid-cols-4"
                            onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
                        >
                            {products.map((product, i) => (
                                <ProductCard key={i} product={product} />
                            ))}
                            {isFetchingNextPage && (
                                <div className="flex justify-center">
                                    <Loader2 className="mx-auto my-3 animate-spin" />
                                </div>
                            )}
                        </InfiniteScrollContainer>
                    )}
                </div>

                <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-background border-t border-gray-200">
                    <div className="flex items-center justify-between h-full px-4">
                        <FilterDrawer>
                            <Button variant="outline" className="flex items-center gap-x-2">
                                <FilterIcon className="w-4 h-4" />
                                Filter
                            </Button>
                        </FilterDrawer>

                        <div className="flex items-center gap-x-2">
                            <p className="text-sm text-gray-500">Sort By</p>
                            <SortDrawer>
                                <Button variant="outline" className="flex items-center gap-x-2">
                                    <SortAscIcon className="w-4 h-4" />
                                    Sort
                                </Button>
                            </SortDrawer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}