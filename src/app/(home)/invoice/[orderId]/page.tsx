import { Metadata } from "next";
import { redirect } from "next/navigation";
import { format } from "date-fns";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";

import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { DownloadButton } from "@/features/home/invoice/components/download-button";

export const metadata: Metadata = {
    title: "TomarSports | Invoice",
    description: "Invoice",
}

interface Props {
    params: Promise<{ orderId: string }>
}

const OrderInvoice = async ({ params }: Props) => {
    const { orderId } = (await params)

    const order = await db.order.findUnique({
        where: {
            id: orderId
        },
        include: {
            orderItems: {
                include: {
                    variant: {
                        include: {
                            product: true
                        }
                    }
                }
            },
        }
    })

    if (!order) redirect("/")

    return (
        <div className="px-3 md:px-0 mt-4 gap-y-4">
            <Card className="w-full max-w-3xl mx-auto max-h-fit">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Invoice</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Invoice Details</h2>
                            <p><span className="font-medium">Invoice Number:</span> {order.id.slice(-6).toUpperCase()}</p>
                            <p><span className="font-medium">Date:</span> {format(order.createdAt, "dd MMMM yyyy")}</p>
                        </div>
                        <div className="max-w-[200px]">
                            <h2 className="text-lg font-semibold mb-2">Customer</h2>
                            <p className="whitespace-break">{order.name}, {order.phone}, {order.altPhone}, {order.city}, {order.area}, {order.zone}</p>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Book</TableHead>
                                <TableHead>Variant</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="font-medium">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.orderItems.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.variant.product.name}</TableCell>
                                    <TableCell>{item.variant.name}</TableCell>
                                    <TableCell className="flex justify-center">
                                        {
                                            item.color && (
                                                <div style={{ backgroundColor: item.color }} className={cn("w-5 h-5 rounded-full")} />
                                            )
                                        }
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>৳{item.variant.price.toFixed(2)}</TableCell>
                                    <TableCell className="font-medium">৳{(item.quantity * item.variant.price).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell>Shipping Charge</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell className="font-medium">৳{order.shippingCharge}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <div className="mt-6 text-right">
                        <p className="text-lg font-semibold">Total: ৳{order.totalPaidAmount}</p>
                    </div>
                </CardContent>
            </Card>
            <DownloadButton order={order} />
        </div>
    )
}

export default OrderInvoice