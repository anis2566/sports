"use client"

import { format } from "date-fns";

import { Table, TableBody, TableHeader, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetReviews } from "../../api/use-get-reviews";
import { EmptyStat } from "@/components/empty-stat";
import { CustomPagination } from "@/components/custom-pagination";
import { Header } from "./header";

export const ReviewList = () => {
    const { data, isLoading } = useGetReviews();

    return (
        <div className="space-y-4">
            <Header />
            {
                isLoading ? <ReviewListSkeleton /> : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-accent/60">
                                <TableHead>Product</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Review</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data?.reviews.map((review) => (
                                    <TableRow key={review.id}>
                                        <TableCell className="max-w-[200px] truncate">{review.product.name}</TableCell>
                                        <TableCell>{review.rating}</TableCell>
                                        <TableCell className="max-w-[300px] truncate">{review.content}</TableCell>
                                        <TableCell>{format(review.createdAt, "dd MMM yyyy")}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                )
            }
            {!isLoading && data?.reviews.length === 0 && <EmptyStat title="No reviews found" />}
            <CustomPagination totalCount={data?.totalCount || 0} />
        </div>
    )
}


export const ReviewListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Product</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
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
