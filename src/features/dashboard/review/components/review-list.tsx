"use client"

import { Eye, MoreVerticalIcon, Trash2 } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetReviewAdmin } from "../../product/api/use-get-review-admin";
import { useDeleteReview, useViewReview } from "@/hooks/use-review";
import { CustomPagination } from "@/components/custom-pagination";
import { EmptyStat } from "@/components/empty-stat";
import { Header } from "../../brand/components/header";

export const ReviewList = () => {
    const { onOpen } = useViewReview();
    const { onOpen: onOpenDeleteReview } = useDeleteReview();

    const { data, isLoading } = useGetReviewAdmin();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Review</CardTitle>
                <CardDescription>Review List</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />
                {
                    isLoading ? <ReviewListSkeleton /> :
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-accent hover:bg-accent/80">
                                    <TableHead>Product</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Review</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.reviews.map((review) => (
                                    <TableRow key={review.id}>
                                        <TableCell className="max-w-[200px] truncate">{review.product.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-x-3">
                                                <Avatar>
                                                    <AvatarImage src={review.user.image || ""} alt={review.user.name || ""} />
                                                    <AvatarFallback>
                                                        {review.user.name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p>{review.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {review.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{review.rating}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{review.content}</TableCell>
                                        <TableCell>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVerticalIcon className="w-4 h-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent side="right" className="p-2 max-w-[180px]">
                                                    <Button variant="ghost" className="flex items-center justify-start gap-x-2 w-full" onClick={() => onOpen({
                                                        productName: review.product.name,
                                                        userName: review.user.name || "",
                                                        rating: review.rating,
                                                        content: review.content,
                                                    })}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </Button>
                                                    <Button variant="ghost" className="flex items-center justify-start gap-x-2 w-full text-red-500 hover:text-red-400" onClick={() => onOpenDeleteReview(review.id)}>
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </Button>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                }
                {!isLoading && data?.totalCount === 0 && <EmptyStat title="No reviews found" />}
                <CustomPagination totalCount={data?.totalCount || 0} />
            </CardContent>
        </Card>
    )
};


export const ReviewListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Product</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}