"use client";

import { Trash } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetBanners } from "@/features/dashboard/banner/api/use-get-banners";
import { ToggleStatus } from "./toggle-status";
import { PRODUCT_STATUS } from "@/constant";
import { useDeleteBanner } from "@/hooks/use-banner";

export const BannerList = () => {
    const { isOpen, onOpen, onClose } = useDeleteBanner();

  const { data, isLoading } = useGetBanners();

    if(isLoading) {
        return <BannerListSkeleton />
    }

    return (
       <div className="w-full grid md:grid-cols-2 gap-6">
            {data?.banners.map((banner) => (
                <div key={banner.id} className="space-y-2">
                    <div className="relative aspect-video max-h-[300px]">
                        <Image src={banner.imageUrl} alt={banner.id} fill className="object-cover" />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Button variant="destructive" size="icon" onClick={() => onOpen(banner.id)}>
                            <Trash className="w-4 h-4" />
                        </Button>
                        <ToggleStatus id={banner.id} status={banner.status as PRODUCT_STATUS} />
                    </div>
                </div>
            ))}
        </div>
  )
};


const BannerListSkeleton = () => {
    return <div className="w-full grid md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-2">
                <div className="relative aspect-video max-h-[300px]">
                    <Skeleton className="w-full h-full" />
                </div>
            </div>
        ))}
    </div>
}
