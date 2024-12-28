"use client";

import { Rating } from "@smastrom/react-rating";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAddReview } from "@/hooks/use-review";
import { useGetReviews } from "@/features/dashboard/product/api/use-get-reviews";

interface ReviewsProps {
    productId: string;
    rating: number;
    totalReviews: number;
}

export const Reviews = ({ productId, rating, totalReviews }: ReviewsProps) => {
    const { onOpen } = useAddReview();
    const { reviews, fetchNextPage, hasNextPage, isFetching, status } = useGetReviews(productId);


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <div className="">
                        <p className="text-xl font-bold">({rating})</p>
                        <Rating style={{ maxWidth: 70 }} value={rating} readOnly />
                    </div>
                    <Button variant="outline" onClick={() => onOpen(productId)}>
                        Add Review
                    </Button>
                </CardTitle>
                <CardDescription>({totalReviews} reviews)</CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    {hasNextPage && (
                        <Button
                            variant="link"
                            className="mx-auto block"
                            disabled={isFetching}
                            onClick={() => fetchNextPage()}
                        >
                            Load previous
                        </Button>
                    )}
                    {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
                    {status === "success" && !reviews.length && (
                        <p className="text-center text-muted-foreground">
                            No reviews yet.
                        </p>
                    )}
                    {status === "error" && (
                        <p className="text-center text-destructive">
                            An error occurred while loading questions.
                        </p>
                    )}
                    <div className="space-y-4">
                        {reviews.map((review, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex space-x-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={review.user.image || ""}
                                            alt={review.user.name || ""}
                                        />
                                        <AvatarFallback>
                                            {review.user.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">{review.user.name}</h3>
                                            {/* <ReactTimeAgo
                                                date={review.createdAt}
                                                locale="en-US"
                                                className="text-xs"
                                            /> */}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Rating style={{ maxWidth: 70 }} value={review.rating} readOnly />
                                            <p className="text-xs text-gray-700">({review.rating})</p>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-2">{review.content}</p>
                                    </div>
                                </div>
                                {/* {question.answers.map((answer) => (
                                    <div className="ml-12 space-y-4" key={answer.id}>
                                        <div className="flex space-x-4">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={answer.user.image || ""}
                                                    alt={answer.user.name || ""}
                                                />
                                                <AvatarFallback>
                                                    {answer.user.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold">{answer.user.name}</h4>
                                                    <span className="text-sm text-gray-500">
                                                        <ReactTimeAgo
                                                            date={answer.createdAt}
                                                            locale="en-US"
                                                            className="text-xs"
                                                        />
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700">{answer.answer}</p>
                                                <div className="flex items-center space-x-4"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))} */}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}