"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import { cn } from "@/lib/utils"

interface Props {
    images: string[]
}

export const Images = ({ images }: Props) => {
    const [currentImage, setCurrentImage] = useState<string>(images[0])

    useEffect(() => {
        setCurrentImage(images[0])
    }, [images])

    return (
        <div className="flex flex-col items-center gap-y-5">
            <div className="border rounded-md px-2 py-4 flex items-center justify-center max-h-[370px] max-w-[280px]">
                <Image
                    alt="Product"
                    className="h-[300px] object-cover rounded-lg"
                    height="300"
                    src={currentImage}
                    width="240"
                />
            </div>

            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full max-w-[240px]"
            >
                <CarouselContent>
                    {[...images].map((image, index) => {
                        const active = image === currentImage
                        return (
                            <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/3 lg:basis-1/4">
                                <div className="p-1">
                                    <div className={cn("border border-gray-300 rounded-md aspect-square max-w-[80px] flex items-center justify-center", active && "border-gray-400 opacity-70")} onClick={() => setCurrentImage(image)}>
                                        <Image
                                            alt="Product"
                                            className="rounded-lg w-[80px] h-auto md:w-[70px] md:h-[50px] object-cover"
                                            height="100"
                                            src={image}
                                            width="100"
                                        />
                                    </div>
                                </div>
                            </CarouselItem>
                        )
                    }
                    )}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}