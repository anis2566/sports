import { Store } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"

interface Props {
    className?: string
}

export const SellerButton = ({ className }: Props) => {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="/seller/register" className={cn(buttonVariants({ variant: "ghost" }), "hover:bg-transparent hover:text-primary", className)} >
                        <span>
                            <Store className="w-5 h-5" />
                        </span>
                        Become a seller
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Sell your products on our platform</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}