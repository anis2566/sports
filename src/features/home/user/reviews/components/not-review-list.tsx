"use client"

import { format } from "date-fns";

import { Table, TableBody, TableHeader, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { EmptyStat } from "@/components/empty-stat";
import { CustomPagination } from "@/components/custom-pagination";
import { Header } from "./header";
import { useGetNotReviewed } from "../../api/use-get-not-reviewed";

export const NotReviewList = () => {
    const { data, isLoading } = useGetNotReviewed();

    return (
        <div className="space-y-4">
            <Header />
            {
                isLoading ? <NotReviewListSkeleton /> : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-accent/60">
                                <TableHead>Product</TableHead>
                                <TableHead>Bought At</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data?.products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="max-w-[200px] truncate">{product.name}</TableCell>
                                        <TableCell>{format(product.orderItems[0].order.createdAt, "dd MMM yyyy")}</TableCell>
                                        <TableCell>
                                            <Button>Review</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                )
            }
            {!isLoading && data?.products.length === 0 && <EmptyStat title="No products found" />}
            <CustomPagination totalCount={data?.totalCount || 0} />
        </div>
    )
}


export const NotReviewListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Product</TableHead>
                    <TableHead>Bought At</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
