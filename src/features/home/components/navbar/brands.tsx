"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import { useGetBrands } from "@/features/home/api/use-get-brands";

export const Brands = () => {
    const { data, isLoading } = useGetBrands();

    if (isLoading) return <BrandsSkeleton />;

    return (
        <div className="md:w-[1300px] h-[500px] flex flex-col justify-between">
            <div className="grid gap-3 p-4 grid-cols-4">
                {
                    data?.brands.map((brand) => (
                        <Link href={`/products?brand=${brand.id}`} className="flex items-center gap-x-2 hover:text-muted-foreground transition-colors" key={brand.name}>
                            <p className="truncate">{brand.name}</p>
                        </Link>
                    ))
                }
            </div>
            <Link href="/books/brand" className={cn(buttonVariants({ variant: "link" }), "flex justify-center")}>আরো দেখুন</Link>
        </div>
    )
}


export const BrandsSkeleton = () => {
    return (
        <div className="md:w-[1300px] h-[500px]">
            <div className="grid gap-3 p-4 grid-cols-4">
                {
                    Array.from({ length: 16 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-x-2 hover:text-muted-foreground transition-colors">
                            <Skeleton className="w-20 h-4" />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}