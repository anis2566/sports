"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { DiscountFilter } from "./discount-filter"
import { PriceFilter } from "./price-filter"
import { Sort } from "./sort-filter"
import { StockFilter } from "./stock-filter"
import { RatingFilter } from "./rating-filter"

export const Filter = () => {
    const router = useRouter()

    const handleReset = () => {
        router.push("/products")
    }

    return (
        <div className="space-y-4 pr-4">
            <Sort />
            <StockFilter />
            <RatingFilter />
            <PriceFilter />
            <DiscountFilter />

            <Button variant="destructive" className="ml-auto flex" onClick={handleReset}>
                Reset Filters
            </Button>
        </div>
    )
}