"use client";

import queryString from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { Rating } from "@smastrom/react-rating";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RatingFilter = () => {
    const [rating, setRating] = useState(0);

    const router = useRouter();
    const searchParams = useSearchParams();

    const handleRatingChange = (value: number) => {
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: "/products",
            query: {
                ...params,
                rating: value,
            },
        }, { skipNull: true, skipEmptyString: true });
        router.push(url);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Rating</CardTitle>
            </CardHeader>
            <CardContent>
                <Rating
                    style={{ maxWidth: 180 }}
                    value={rating}
                    onChange={(value: number) => {
                        setRating(value)
                        handleRatingChange(value)
                    }}
                    transition="zoom"
                />
            </CardContent>
        </Card>
    )
}