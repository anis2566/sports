"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";

import { LoadingButton } from "@/components/loading-button";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { OrderSchema, OrderSchemaType } from "../schema";
import { PAYMENT_METHOD } from "@/constant";
import { useCreateOrder } from "../api/use-create-order";
import { useGetCities } from "../api/use-get-cities";
import { useGetAreas } from "../api/use-get-areas";
import { useGetZones } from "../api/use-get-zones";

export const CheckoutForm = () => {
    const { cart } = useCart();

    const { data: cities, isLoading: isCitiesLoading } = useGetCities()

    const { mutate, isPending } = useCreateOrder()

    const form = useForm<OrderSchemaType>({
        resolver: zodResolver(OrderSchema),
        defaultValues: {
            name: "",
            phone: "",
            altPhone: "",
            cityId: "",
            areaId: "",
            zoneId: "",
            address: "",
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

    const { data: areas, isLoading: isAreasLoading } = useGetAreas(form.watch("cityId") || undefined)
    const { data: zones, isLoading: isZonesLoading } = useGetZones(form.watch("areaId") || undefined)

    const onSubmit = (data: OrderSchemaType) => {
        mutate(data)
    }

    const totalPrice = cart.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    if (cart.length === 0) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-y-4">
                <h1 className="text-2xl font-semibold text-muted-foreground">Your cart is empty!</h1>
                <Link href="/">
                    <Button>Continue shopping</Button>
                </Link>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid md:grid-cols-3 gap-6 relative">
                <div className="md:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                            <CardDescription>Please fill up the form to continue</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="altPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Alt Phone</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="cityId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <Select
                                                onValueChange={value => {
                                                    field.onChange(value)
                                                    form.setValue("areaId", "")
                                                }}
                                                defaultValue={field.value}
                                                disabled={isCitiesLoading || isPending}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a city" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        cities?.map((city) => (
                                                            <SelectItem key={city.cityId} value={city.id}>{city.nameBangla}</SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="areaId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Area</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isAreasLoading || isPending}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select an area" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        areas?.map((area) => (
                                                            <SelectItem key={area.areaId} value={area.id}>{area.nameBangla}</SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Collapsible open={zones && zones.length > 0}>
                                    <CollapsibleContent>
                                        <FormField
                                            control={form.control}
                                            name="zoneId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Zone</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isZonesLoading || isPending}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a zone" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                zones?.map((zone) => (
                                                                    <SelectItem key={zone.zoneId} value={zone.id}>{zone.nameBangla}</SelectItem>
                                                                ))
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CollapsibleContent>
                                </Collapsible>

                            </div>
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Address</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                        onClick={() => { }}
                        type="submit"
                        className="hidden md:block"
                    />
                </div>
                <div className={cn("flex md:hidden flex-col fixed bottom-0 left-0 right-0 z-50 px-3")}>
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 5000,
                            }),
                        ]}
                        orientation="vertical"
                        className={cn("w-full bg-background")}
                    >
                        <CarouselContent className="h-[60px]">
                            {
                                ["সম্পূর্ণ ক্যাশ অন ডেলিভারিতে অর্ডার করুন", "পণ্য হতে পেয়ে মূল্য পরিশোধ করুন", "৭ দিনে হ্যাপি রিটার্নস"].map((text) => (
                                    <CarouselItem key={text} className="flex items-center justify-center">
                                        <p className="text-sm text-muted-foreground">{text}</p>
                                    </CarouselItem>
                                ))
                            }
                        </CarouselContent>
                    </Carousel>
                    <LoadingButton
                        isLoading={isPending}
                        title={`Confirm Order ৳${(totalPrice + form.watch("shippingCharge")).toFixed(2)}`}
                        loadingTitle="Processing..."
                        onClick={() => { }}
                        type="submit"
                    />
                </div>
            </form>
        </Form>
    )
}