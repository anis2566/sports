"use client";

import { Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import { useCart, useOpenCartModal } from "@/hooks/use-cart";

export const CartModal = () => {
    const { cart, removeFromCart, decrementQuantity, incrementQuantity } = useCart();
    const { open, onClose } = useOpenCartModal();

    const handleRemoveFromCart = (productId: string) => {
        removeFromCart(productId);
        toast.success("Product removed from cart");
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Your Cart</DialogTitle>
                    <DialogDescription>
                        {cart.length} items in your cart
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[50vh]">
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div key={item.product.id} className="flex justify-between">
                                <div className="flex gap-x-3">
                                    <Image src={item.variant.images[0]} alt={item.product.name} width={100} height={100} />
                                    <div className="flex flex-col gap-y-1">
                                        <Link href={`/products/${item.product.id}`} className="text-sm md:text-lg font-semibold hover:underline truncate w-full">{item.product.name}</Link>
                                        <div className="flex items-center gap-x-2">
                                            <p className="text-sm font-semibold">৳{item.variant.discountPrice ? item.variant.discountPrice : item.variant.price}</p>
                                        </div>
                                        <p className="text-sm">
                                            {item.quantity} * {item.price} = ৳{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-x-2">
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
                                                <TooltipProvider delayDuration={0}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="outline" size="icon" onClick={() => removeFromCart(item.product.id)}>
                                                                <Trash2 className="w-4 h-4 text-red-500" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Remove from cart
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div className="flex items-center">
                                                <TooltipProvider delayDuration={0}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item.product.id)}>
                                                                <Trash2 className="w-4 h-4 text-red-500" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Remove from cart
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">Total: ৳{cart.reduce((acc, item) => acc + (item.variant.discountPrice ? item.variant.discountPrice : item.variant.price) * item.quantity, 0).toFixed(2)}</p>
                    <Button asChild onClick={onClose} disabled={cart.length === 0}>
                        <Link href="/checkout">Checkout</Link>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}