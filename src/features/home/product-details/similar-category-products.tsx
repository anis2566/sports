"use client"

import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import { useGetSimilarCategoryProducts } from "@/features/dashboard/product/api/use-get-similar-category-products";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";

export const SimilarCategoryProducts = ({ categoryId }: { categoryId: string }) => {
    const { data, isLoading } = useGetSimilarCategoryProducts(categoryId);

    return <div className="px-3 md:px-0 space-y-2">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-600">Similar Products</h2>
            <Button variant="outline" size="sm">View All</Button>
        </div>

        <Carousel
            opts={{
                align: "start",
            }}
            className="w-full relative"
        >
            <CarouselContent>
                {
                    isLoading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <CarouselItem key={index} className="basis-1/2 md:basis-1/6">
                                <ProductCardSkeleton />
                            </CarouselItem>
                        ))
                    ) : (
                        data?.map((product) => (
                            <CarouselItem key={product.id} className="basis-1/2 md:basis-1/6">
                                <ProductCard product={product} />
                            </CarouselItem>
                        ))
                    )
                }
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 z-40" />
            <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 z-40" />
        </Carousel>
    </div>;
};