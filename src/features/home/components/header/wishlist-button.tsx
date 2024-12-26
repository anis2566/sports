"use client"

import { Heart } from "lucide-react"
import Link from "next/link"

import { TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Tooltip } from "@/components/ui/tooltip"

import { useWishlist } from "@/hooks/use-wishlist"
import { cn } from "@/lib/utils"

export const WishlistButton = () => {
    const { wishlist } = useWishlist();

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="/wishlist" className={cn("relative mr-3 md:mr-4", wishlist.length === 0 && "hidden")}>
                        <Heart className="w-5 h-5" />
                        <div className={cn("absolute -top-2 -right-4 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white bg-red-500", wishlist.length === 0 && "hidden")}>
                            {wishlist.length}
                        </div>
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>View your wishlist</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}