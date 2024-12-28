"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import queryString from "query-string"

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export const StockFilter = () => {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    const handleCheckChange = (checked: boolean) => {
        const params = Object.fromEntries(searchParams.entries())
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                inStock: checked === true ? "true" : null
            }
        }, { skipEmptyString: true, skipNull: true })
        router.push(url)
    }

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                    <Switch id="in-stock" onCheckedChange={handleCheckChange} />
                    <Label htmlFor="in-stock">In Stock</Label>
                </div>
            </CardContent>
        </Card>
    )
}