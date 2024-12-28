"use client";

import queryString from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const Sort = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSortChange = (value: string) => {
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: "/products",
            query: {
                ...params,
                sort: value,
            },
        }, { skipNull: true, skipEmptyString: true });
        router.push(url);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sort</CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup onValueChange={handleSortChange}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="total_sell_asc" id="total_sell_asc" />
                        <Label htmlFor="total_sell_asc" className="text-sm text-gray-500">Best Sellers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="b_desc" id="b_desc" />
                        <Label htmlFor="b_desc" className="text-sm text-gray-500">Newest</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="price_desc" id="price_desc" />
                        <Label htmlFor="price_desc" className="text-sm text-gray-500">Price High to Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="price_asc" id="price_asc" />
                        <Label htmlFor="price_asc" className="text-sm text-gray-500">Price Low to High</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="discount_desc" id="discount_desc" />
                        <Label htmlFor="discount_desc" className="text-sm text-gray-500">Discount High to Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="discount_asc" id="discount_asc" />
                        <Label htmlFor="discount_asc" className="text-sm text-gray-500">Discount Low to High</Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    )
}