import { useState } from "react";
import queryString from "query-string"
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

export const DiscountFilter = () => {
    const [value, setValue] = useState([0, 100]);

    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    const handleValueChange = (newValue: number[]) => {
        setValue(newValue);

        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...Object.fromEntries(searchParams.entries()),
                discountMin: newValue[0],
                discountMax: newValue[1]
            }
        }, { skipEmptyString: true, skipNull: true })
        router.push(url)
    }

    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <Label className="leading-6">Discount Range</Label>
                        <output className="text-sm font-medium tabular-nums">
                            {value[0]} - {value[1]}
                        </output>
                    </div>
                    <Slider value={value} step={1} max={100} min={0} onValueChange={handleValueChange} aria-label="Discount Range" />
                </div>
            </CardContent>
        </Card>
    );
}
