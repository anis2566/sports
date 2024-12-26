"use client"

import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"

import { useGetBanners } from "../../api/use-get-banners"

export const Slider = () => {
    const { data, isLoading } = useGetBanners();

    return (
        <div className="w-full px-2 md:px-0">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 5000,
                    }),
                ]}
                className="w-full max-h-[300px] relative"
            >
                <CarouselContent>
                    {
                        isLoading ? (
                            Array.from({ length: 2 }).map((_, index) => (
                                <CarouselItem key={index}>
                                    <SliderItemSkeleton />
                                </CarouselItem>
                            ))
                        ) : (
                            data?.banners.map((banner, index) => (
                                <CarouselItem key={index}>
                                    <Image src={banner.imageUrl} alt={banner.id} width={1000} height={194} className="w-full h-full md:h-[300px] object-cover" />
                                </CarouselItem>
                            ))
                        )
                    }
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2" />
                <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2" />
            </Carousel>
        </div>
    )
}


const SliderItemSkeleton = () => {
    return <Skeleton className="w-full h-[120px] md:h-[300px]" />
}