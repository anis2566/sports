"use client"

import { Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableHeader, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetOrders } from "../../api/use-get-orders";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/constant";
import { EmptyStat } from "@/components/empty-stat";
import { CustomPagination } from "@/components/custom-pagination";
import { Header } from "./header";

interface OrderListProps {
    userId: string;
}

export const OrderList = ({ userId }: OrderListProps) => {
    const { data, isLoading } = useGetOrders(userId);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>Manage your orders here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative pb-20 md:pb-0">
                <Header />
                {
                    isLoading ? <OrderListSkeleton /> : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-accent hover:bg-accent/80">
                                    <TableHead>Items</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Payment Method</TableHead>
                                    <TableHead>Payment Status</TableHead>
                                    <TableHead>Order Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    data?.orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="max-w-[200px] truncate">
                                                {
                                                    order.orderItems.map((item) => (
                                                        <p key={item.id} className="max-w-[200px] truncate">{item.product.name}</p>
                                                    ))
                                                }
                                            </TableCell>
                                            <TableCell>৳{order.totalPaidAmount}</TableCell>
                                            <TableCell>{format(order.createdAt, "dd MMM yyyy")}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{order.paymentMethod}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="rounded-full" variant={order.paymentStatus === PAYMENT_STATUS.Paid ? "default" : order.paymentStatus === PAYMENT_STATUS.Failed ? "destructive" : "outline"}>{order.paymentStatus}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="rounded-full" variant={order.status === ORDER_STATUS.Delivered ? "default" : order.status === ORDER_STATUS.Cancelled ? "destructive" : order.status === ORDER_STATUS.Processing ? "secondary" : "outline"}>{order.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button asChild variant="ghost" size="icon">
                                                    <Link
                                                        href={`/user/orders/${order.id}`}
                                                        className="flex items-center gap-x-3"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    )
                }
                {!isLoading && data?.orders.length === 0 && <EmptyStat title="No orders found" />}
                <CustomPagination totalCount={data?.totalCount || 0} />
            </CardContent>
        </Card>
    )
}


export const OrderListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Actions</TableHead>
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
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
