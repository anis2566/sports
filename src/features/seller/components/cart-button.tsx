"use client"

import { ShoppingCart } from "lucide-react"
import Link from "next/link"

import { TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Tooltip } from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"
import { useSellerCart } from "@/hooks/use-seller-cart"

export const CartButton = () => {
    const { cart } = useSellerCart();

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="/seller/cart" className="relative mr-3 md:mr-4">
                        <ShoppingCart className="w-5 h-5" />
                        <div className={cn("absolute -top-2 -right-4 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white bg-red-500", cart.length === 0 && "hidden")}>
                            {cart.length}
                        </div>
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>View your cart</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}