"use client"

import { XIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import { StockFilter } from "./stock-filter"
import { RatingFilter } from "./rating-filter"
import { PriceFilter } from "./price-filter"
import { DiscountFilter } from "./discount-filter"


interface FilterDrawerProps {
    children: React.ReactNode
}

export const FilterDrawer = ({ children }: FilterDrawerProps) => {
    const router = useRouter()

    const handleReset = () => {
        router.push("/products")
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="flex justify-center items-center relative">
                        <span>Filter</span>
                        <DrawerClose asChild>
                            <Button variant="secondary" size="icon" className="absolute right-0">
                                <XIcon className="w-4 h-4 text-rose-500" />
                            </Button>
                        </DrawerClose>
                    </DrawerTitle>
                </DrawerHeader>
                <div className="px-4 space-y-4">
                    <StockFilter />
                    <RatingFilter />
                    <PriceFilter />
                    <DiscountFilter />
                </div>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full text-rose-500" onClick={handleReset}>
                            Reset Filters
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>

    )
}