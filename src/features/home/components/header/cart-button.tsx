"use client"

import { ShoppingCart } from "lucide-react"
import Link from "next/link"

import { TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Tooltip } from "@/components/ui/tooltip"

import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

export const CartButton = () => {
    const { cart } = useCart();

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="/cart" className="relative mr-3 md:mr-4">
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