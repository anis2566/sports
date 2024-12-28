"use client"

import { Rating } from "@smastrom/react-rating";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Category, Product, Variant } from "@prisma/client";
import "@smastrom/react-rating/style.css";
import { toast } from "sonner";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "./ui/skeleton";

import { useCart, useOpenCartModal } from "@/hooks/use-cart";

type CategoryWithExtended = Omit<Category, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
};

type VariantWithExtended = Omit<Variant, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
};

type ProductWithExtended = Omit<Product, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
};

interface ProductWithRelations extends ProductWithExtended {
    category: CategoryWithExtended;
    variants: VariantWithExtended[];
}

interface Props {
    product: ProductWithRelations;
}

export const ProductCard = ({ product }: Props) => {
    const {addToCart} = useCart()
    const { onOpen } = useOpenCartModal();

    const handleAddToCart = () => {
        const cartItem = {
            product: product,
            variant: product.variants[0],
            color: product.variants[0].colors[0],
            price: product.variants[0].discountPrice || product.variants[0].price,
            quantity: 1,
        }
        addToCart(cartItem)
        toast.success("Added to cart", {
            duration: 5000,
        })
        onOpen()
    }

    return (
        <div className="w-full space-y-2 min-h-[300px] flex flex-col justify-between border relative">
            <Link href={`/products/${product.id}`} className="px-2 py-1 group h-full">
                <div className="w-full space-y-2">
                    <div className="relative aspect-square w-full max-h-[150px]">
                        <Image src={product.variants[0].images[0]} alt={product.name} fill className="mx-auto object-contain group-hover:scale-105 transition-all duration-300 group-hover:rotate-3" />
                    </div>
                    <div className="overflow-hidden space-y-1.5">
                        <p className="text-sm font-semibold">{product.name.length > 40 ? `${product.name.slice(0, 40)}...` : product.name}</p>
                        <p className="text-xs text-muted-foreground flex leading-0">
                            {product.category.name.length > 50 ? `${product.category.name.slice(0, 50)}...` : product.category.name}
                        </p>
                        <div className="flex items-center gap-x-2">
                            <Rating style={{ maxWidth: 70 }} value={4.5} readOnly />
                            <p className="text-sm text-muted-foreground">({product.totalReview})</p>
                        </div>
                        {
                            product.totalStock > 0 ? (
                                <p className="text-sm text-green-500">In Stock</p>
                            ) : (
                                <p className="text-sm text-red-500">Out of Stock</p>
                            )
                        }
                        <div className="flex items-center gap-x-1">
                            {product.variants[0].discountPrice ? (
                                <>
                                <p className="tracking-wider text-base">৳{product.variants[0].discountPrice}</p>
                                <p className="tracking-wider text-xs text-red-500 line-through">৳{product.variants[0].price}</p>
                                </>
                            ) : (
                                <p className="tracking-wider text-base">৳{product.variants[0].price}</p>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
            <div className="flex justify-between items-center p-2 w-full gap-x-3">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="default" className="flex-1 flex items-center gap-x-3" onClick={handleAddToCart}>
                                <ShoppingCart className="w-4 h-4 hidden md:block" />
                                <p>Add to cart</p>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add to cart</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Heart className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add to wishlist</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}


export const ProductCardSkeleton = () => {
    return (
        <Card className="w-full space-y-2 relative">
            <CardContent className="px-2 py-3 group">
                <div className="relative aspect-square w-full max-h-[150px]">
                    <Skeleton className="w-full h-full" />
                </div>
                <div className="space-y-1">
                    <Skeleton className="h-4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-10" />
                    </div>
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-2">
                <div className="flex items-center gap-x-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-8 w-8" />
            </CardFooter>
        </Card>
    )
}