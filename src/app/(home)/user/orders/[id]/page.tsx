import { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

import { ORDER_STATUS } from "@/constant";
export const metadata: Metadata = {
    title: "TomarSports | Order | Detail",
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

    if (!order) redirect("/user/orders")

    return (
        <div className="w-full grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Products</CardTitle>
                        <CardDescription>List of products in this order.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {
                            order.orderItems.map((item) => (
                                <div key={item.id} className="flex justify-between">
                                    <div className="flex gap-x-3">
                                        <Image src={item.variant.images[0]} alt={item.variant.name} width={100} height={100} />
                                        <div className="flex flex-col gap-y-1">
                                            <p className="text-sm md:text-lg font-semibold">{item.variant.name}</p>
                                            {
                                                item.color && (
                                                    <div style={{ backgroundColor: item.color }} className={cn("w-5 h-5 rounded-full")} />
                                                )
                                            }
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
                        <Badge className="rounded-full" variant={order.status === ORDER_STATUS.Delivered ? "default" : order.status === ORDER_STATUS.Cancelled ? "destructive" : order.status === ORDER_STATUS.Processing ? "secondary" : "outline"}>{order.status}</Badge>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default DetailOrder