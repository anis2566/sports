"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { LoadingButton } from "@/components/loading-button";
import { PAYMENT_METHOD } from "@/constant";
import { OrderSchema, OrderSchemaType } from "../schema";
import { useSellerCart } from "@/hooks/use-seller-cart";
import { useCreateOrder } from "../api/use-create-order";

export const CheckoutForm = () => {
    const { cart } = useSellerCart();

    const { mutate: createOrder, isPending } = useCreateOrder();

    const form = useForm<OrderSchemaType>({
        resolver: zodResolver(OrderSchema),
        defaultValues: {
            shippingCharge: 100,
            paymentMethod: undefined,
            orderItems: cart.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: item.price,
                variantId: item.variant.id,
                color: item.color,
            })),
        }
    })

    const onSubmit = (data: OrderSchemaType) => {
        createOrder(data);
    }

    const totalPrice = cart.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    if (cart.length === 0) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-y-4">
                <h1 className="text-2xl font-semibold text-muted-foreground">Your cart is empty!</h1>
                <Link href="/seller/marketplace">
                    <Button>Continue shopping</Button>
                </Link>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid md:grid-cols-3 gap-6 relative">
                <div className="md:col-span-2 space-y-4">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Products</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.product.id} className="flex justify-between">
                                    <div className="flex gap-x-3">
                                        <Image src={item.variant.images[0]} alt={item.product.name} width={100} height={100} className="w-[100px] h-[100px]" />
                                        <div className="flex flex-col gap-y-1">
                                            <Link href={`/products/${item.product.id}`} className="text-sm md:text-lg font-semibold hover:underline whitespace-break">{item.product.name}</Link>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between items-end gap-y-1">
                                        <p className="hidden md:block text-sm md:text-lg font-semibold">৳{item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                            <CardDescription>Please select a payment method to continue</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                                disabled={isPending}
                                            >
                                                <FormItem className="space-y-3">
                                                    <div>
                                                        <h1 className="text-sm font-semibold">ক্যাশ অন ডেলিভারি</h1>
                                                        <p className="text-sm text-muted-foreground">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</p>
                                                    </div>
                                                    <div className="flex items-center gap-x-3 border border-gray-200 rounded-md py-2 px-4 max-w-fit">
                                                        <FormControl>
                                                            <RadioGroupItem value={PAYMENT_METHOD.COD} />
                                                        </FormControl>
                                                        <FormLabel className="flex items-center gap-x-2">
                                                            <Image src="/cod.jpg" alt="cod" width={40} height={40} />
                                                            <p className="text-md text-muted-foreground">ক্যাশ অন ডেলিভারি</p>
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Checkout Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between border-b p-2">
                                <p>Subtotal</p>
                                <p>৳{totalPrice}</p>
                            </div>
                            <div className="flex justify-between border-b p-2">
                                <p>Shipping <span className="text-xs text-muted-foreground">(changeable)</span></p>
                                <p>৳{form.watch("shippingCharge")}</p>
                            </div>
                            <div className="flex justify-between p-2">
                                <p>Total</p>
                                <p>৳{(totalPrice + form.watch("shippingCharge")).toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-x-2 mt-4">
                                <Input type="text" placeholder="Enter your coupon code" disabled={isPending} />
                                <Button variant="secondary" disabled={isPending}>Apply</Button>
                            </div>
                        </CardContent>
                    </Card>
                    <LoadingButton
                        isLoading={isPending}
                        title={`Confirm Order ৳${(totalPrice + form.watch("shippingCharge")).toFixed(2)}`}
                        loadingTitle="Processing..."
                        onClick={form.handleSubmit(onSubmit)}
                        type="submit"
                        className="w-full max-w-fit"
                    />
                </div>
            </form>
        </Form>
    )
}