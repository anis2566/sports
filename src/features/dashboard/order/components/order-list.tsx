"use client"

import { Eye, MoreVerticalIcon, RefreshCcw, Trash2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge"

import { EmptyStat } from "@/components/empty-stat"
import { useDeleteOrder, useOrderStatus } from "@/hooks/use-order"
import { useGetOrders } from "../api/use-get-orders"
import { CustomPagination } from "@/components/custom-pagination"
import { ORDER_STATUS } from "@/constant"

export const OrderList = () => {
    const { onOpen } = useOrderStatus()
    const { onOpen: onOpenDeleteOrder } = useDeleteOrder()

    const searchParams = useSearchParams()
    const limit = parseInt(searchParams.get("limit") || "5")

    const { data, isLoading } = useGetOrders()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>Manage your orders here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* <Header /> */}
                {isLoading ? <OrderListSkeleton /> : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-accent hover:bg-accent/80">
                                <TableHead>User</TableHead>
                                <TableHead>Recepient</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>No of Items</TableHead>
                                <TableHead>Total Price</TableHead>
                                <TableHead>Payment Method</TableHead>
                                <TableHead>Payment Status</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-x-3">
                                            <Avatar>
                                                <AvatarImage src={order.user.image || ""} alt={order.user.name || ""} />
                                                <AvatarFallback>
                                                    {order.user.name?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p>{order.user.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.name}</TableCell>
                                    <TableCell>{order.phone}</TableCell>
                                    <TableCell>{order.orderItems.length}</TableCell>
                                    <TableCell>{order.totalPaidAmount}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{order.paymentMethod}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{order.paymentStatus}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === ORDER_STATUS.Pending ? "outline" : order.status === ORDER_STATUS.Processing ? "secondary" : order.status === ORDER_STATUS.Shipped ? "secondary" : order.status === ORDER_STATUS.Delivered ? "default" : "destructive"} className="rounded-full">{order.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVerticalIcon className="w-4 h-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent side="right" className="p-2 max-w-[180px]">
                                                <Button asChild variant="ghost" className="flex items-center justify-start gap-x-2 w-full">
                                                    <Link href={`/dashboard/order/${order.id}`} >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" className="flex items-center justify-start gap-x-2 w-full" onClick={() => onOpen(order.id, order.status as ORDER_STATUS)}>
                                                    <RefreshCcw className="w-4 h-4 mr-2" />
                                                    Change Status
                                                </Button>
                                                <Button variant="ghost" className="flex items-center justify-start gap-x-2 w-full text-red-500 hover:text-red-400" onClick={() => onOpenDeleteOrder(order.id)}>
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
                )}
                {!isLoading && data?.orders.length === 0 && <EmptyStat title="No orders found" />}
                <CustomPagination pageSize={limit} totalCount={data?.totalCount || 0} />
            </CardContent>
        </Card>
    )
}


export const OrderListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>User</TableHead>
                    <TableHead>Recepient</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>No of Items</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Status</TableHead>
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
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
