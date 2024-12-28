"use client"

import Link from "next/link";
import Image from "next/image";
import { Trash2, Heart, Plus, Minus, ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay"
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

import { ProductWithRelations, useCart } from "@/hooks/use-cart";
import { useCurrent } from "@/features/auth/api/use-current";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

export const CartPage = () => {
    const { cart, removeFromCart, incrementQuantity, decrementQuantity } = useCart()
    const { addToWishlist } = useWishlist()

    const { data } = useCurrent()

    const handleAddToWishlist = (product: ProductWithRelations) => {
        addToWishlist(product);
        toast.success("Product added to wishlist");
        removeFromCart(product.id);
    }

    if (cart.length === 0) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-y-4">
                <Image src="/empty-cart.png" alt="empty cart" width={200} height={200} />
                <h1 className="text-2xl font-semibold text-muted-foreground">Your cart is empty!</h1>
                <Link href="/">
                    <Button>Continue shopping</Button>
                </Link>
            </div>
        )
    }


    return (
        <div className="mt-4 px-3 md:px-0 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>{cart.length} items in cart</CardTitle>
                        <CardDescription>
                            Total ৳{cart.reduce((acc, item) => acc + (item.quantity * item.price), 0)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {cart.map((item) => (
                            <div key={item.product.id} className="flex justify-between">
                                <div className="flex gap-x-3">
                                    <Image src={item.variant.images[0]} alt={item.product.name} width={100} height={100} className="w-[100px] h-[100px]" />
                                    <div className="flex flex-col gap-y-1">
                                        <Link href={`/products/${item.product.id}`} className="text-sm md:text-lg font-semibold hover:underline whitespace-break">{item.product.name}</Link>
                                        <div className="flex md:hidden items-center gap-x-2">
                                            <p className="text-sm md:text-lg font-semibold">৳{item.price * item.quantity}</p>
                                            <p className="text-sm text-rose-500 line-through">৳{item.variant.discountPrice || item.variant.price * item.quantity}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{item.variant.stock} left</p>
                                        <div className="flex items-center">
                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Remove from cart
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => handleAddToWishlist(item.product)}>
                                                            <Heart className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Add to wishlist
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between items-end gap-y-1">
                                    <p className="hidden md:block text-sm md:text-lg font-semibold">৳{item.price}</p>
                                    <div className="flex flex-col md:flex-row items-center gap-x-2">
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="icon" onClick={() => decrementQuantity(item.product.id)}>
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Decrease quantity
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <p className="text-lg">{item.quantity}</p>
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="icon" onClick={() => incrementQuantity(item.product.id)}>
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Increase quantity
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Checkout Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between border-b p-2">
                            <p>Subtotal</p>
                            <p>৳{cart.reduce((acc, item) => acc + (item.quantity * item.price), 0)}</p>
                        </div>
                        <div className="flex justify-between border-b p-2">
                            <p>Shipping <span className="text-xs text-muted-foreground">(changeable)</span></p>
                            <p>৳100</p>
                        </div>
                        <div className="flex justify-between border-b p-2">
                            <p>Total</p>
                            <p>৳{cart.reduce((acc, item) => acc + (item.quantity * item.price), 100).toFixed(2)}</p>
                        </div>
                        <div className="hidden md:block">
                            {
                                data?.user?.userId ? (

                                    <Button className="w-full" asChild>
                                        <Link href="/checkout">
                                            Checkout
                                            <ArrowRight className="w-4 h-4 ml-2 animate-pulse" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button className="w-full" asChild>
                                        <Link href={`/auth/sign-in?callbackUrl=/cart`}>
                                            Login to checkout
                                            <ArrowRight className="w-4 h-4 ml-2 animate-pulse" />
                                        </Link>
                                    </Button>
                                )
                            }
                        </div>
                    </CardContent>
                </Card>
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
                <div>
                    {
                        data?.user?.userId ? (

                            <Button className="w-full" asChild>
                                <Link href="/checkout">
                                    Checkout
                                    <ArrowRight className="w-4 h-4 ml-2 animate-pulse" />
                                </Link>
                            </Button>
                        ) : (
                            <Button className="w-full" asChild>
                                <Link href={`/auth/sign-in?callbackUrl=/cart`}>
                                    Login to checkout
                                    <ArrowRight className="w-4 h-4 ml-2 animate-pulse" />
                                </Link>
                            </Button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}