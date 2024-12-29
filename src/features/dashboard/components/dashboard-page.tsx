"use client"

import { Check, DollarSign, RefreshCcw, ShoppingCart, Eye } from "lucide-react";
import { useGetDashboardData } from "../api/use-get-dashboard-data";
import { StatCard } from "./stat-card";
import { OrderStat } from "./order-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardPage = () => {
    const { data, isLoading } = useGetDashboardData();
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
                <StatCard
                    icon={DollarSign}
                    title="Today Earnings"
                    value={data?.todayOrders || 0}
                    bgColor="bg-sky-500/10"
                    textColor="text-sky-500"
                    chartData={[{ name: "Yesterday", count: data?.yesterdayOrders || 0 }, { name: "Today", count: data?.todayOrders || 0 }]}
                    isLoading={isLoading}
                />
                <StatCard
                    icon={DollarSign}
                    title="This Week"
                    value={data?.weekOrderTotal || 0}
                    bgColor="bg-amber-500/10"
                    textColor="text-amber-500"
                    chartData={data?.weekOrders.map((order) => ({ name: order.name, count: order.count })) || []}
                    isLoading={isLoading}
                />
                <StatCard
                    icon={DollarSign}
                    title="This Month"
                    value={data?.monthOrderTotal || 0}
                    bgColor="bg-indigo-500/10"
                    textColor="text-indigo-500"
                    chartData={data?.monthOrders.map((order) => ({ name: order.count.toString(), count: order.count })) || []}
                    isLoading={isLoading}
                />
                <StatCard
                    icon={DollarSign}
                    title="This Year"
                    value={data?.yearOrderTotal || 0}
                    bgColor="bg-emerald-500/10"
                    textColor="text-emerald-500"
                    chartData={data?.yearOrders.map((order) => ({ name: order.month, count: order.count })) || []}
                    isLoading={isLoading}
                />
            </div>

            <div className='grid md:grid-cols-4 gap-4'>
                <OrderStat title='Pending' value={data?.pendingOrders || 0} icon={ShoppingCart} className='bg-orange-500' />
                <OrderStat title='Delivered' value={data?.deliveredOrders || 0} icon={Check} className='bg-green-500' />
                <OrderStat title='Returned' value={data?.returnedOrders || 0} icon={RefreshCcw} className='bg-red-500' />
                <OrderStat title='Total Orders' value={data?.totalOrders || 0} icon={ShoppingCart} className='bg-sky-500' />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <div className="col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <RecentOrdersSkeleton /> : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-accent hover:bg-accent/80">
                                            <TableHead>Recepient</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>No of Item</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            data?.recentOrders.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell>{order.name}</TableCell>
                                                    <TableCell>{order.phone}</TableCell>
                                                    <TableCell>{order.orderItems.length}</TableCell>
                                                    <TableCell>{order.totalPaidAmount}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="default" className="rounded-full">
                                                            {order.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button asChild variant="ghost" size="icon">
                                                            <Link href={`/dashboard/order/${order.id}`}>
                                                                <Eye className="w-4 h-4" />
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}


export const RecentOrdersSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Recepient</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>No of Item</TableHead>
                    <TableHead>Total</TableHead>
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
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
