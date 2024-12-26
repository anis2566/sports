import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { db } from "@/lib/db";
import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { ORDER_STATUS } from "@/constant";
import { StatusButton } from "@/features/dashboard/order/components/status-button";

export const metadata: Metadata = {
    title: "Dashboard | Order | Detail",
    description: "Detail Order",
}

interface Props {
    params: Promise<{ id: string }>
}

const DetailOrder = async ({ params }: Props) => {
    const { id } = (await params)

    const order = await db.order.findUnique({
        where: {
            id: id
        },
        include: {
            orderItems: {
                include: {
                    variant: true
                }
            },
        }
    })

    if (!order) redirect("/dashboard/order")

    return (
        <ContentLayout title="Order">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/order">Order</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Detail</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="w-full grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Books</CardTitle>
                            <CardDescription>List of books in this order.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {
                                order.orderItems.map((item) => (
                                    <div key={item.id} className="flex justify-between">
                                        <div className="flex gap-x-3">
                                            <Image src={item.variant.images[0]} alt={item.variant.name} width={100} height={100} />
                                            <div className="flex flex-col gap-y-1">
                                                <p className="text-sm md:text-lg font-semibold">{item.variant.name}</p>
                                                <p className="text-sm font-semibold">{item.quantity}x copy</p>
                                                <p className="text-sm">৳{item.variant.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Info</CardTitle>
                            <CardDescription>Shipping information for this order.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-semibold">Name</p>
                                <p className="text-muted-foreground">{order.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Phone</p>
                                <p className="text-muted-foreground">{order.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Alternate Phone</p>
                                <p className="text-muted-foreground">{order?.altPhone}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">City</p>
                                <p className="text-muted-foreground">{order.city}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Thana</p>
                                <p className="text-muted-foreground">{order.area}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Zone</p>
                                <p className="text-muted-foreground">{order.zone}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between border-b p-2">
                                <p>Subtotal</p>
                                <p>৳{order.totalPrice}</p>
                            </div>
                            <div className="flex justify-between border-b p-2">
                                <p>Shipping</p>
                                <p>৳{order.shippingCharge}</p>
                            </div>
                            <div className="flex justify-between p-2">
                                <p>Total</p>
                                <p>৳{order.totalPaidAmount}</p>
                            </div>

                        </CardContent>
                        <CardFooter>
                            <div className="flex justify-between w-full">
                                <Badge className="rounded-full h-6" variant={order.status === ORDER_STATUS.Pending ? "outline" : order.status === ORDER_STATUS.Processing ? "outline" : order.status === ORDER_STATUS.Shipped ? "secondary" : order.status === ORDER_STATUS.Delivered ? "default" : "destructive"}>
                                    {order.status}
                                </Badge>
                                <StatusButton status={order.status as ORDER_STATUS} id={order.id} />
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </ContentLayout>
    )
}

export default DetailOrder