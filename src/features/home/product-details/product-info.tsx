"use client"

import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { Layers3, ShoppingCart, Heart, Share2, CornerDownLeft } from "lucide-react";
import { Rating } from "@smastrom/react-rating";
import { toast } from "sonner";
import Image from "next/image";
import "@smastrom/react-rating/style.css";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { cn } from "@/lib/utils";
import { ProductWithRelations, useCart, VariantWithExtended } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";

interface Props {
    product: ProductWithRelations
    activeVariant: VariantWithExtended
    setActiveVariant: Dispatch<SetStateAction<VariantWithExtended>>
}

export default function ProductInfo({ product, activeVariant, setActiveVariant }: Props) {
    const [color, setColor] = useState<string>("")

    const { addToCart } = useCart()
    const { addToWishlist } = useWishlist()

    const handleAddToCart = () => {
        const cartItem = {
            product: product,
            variant: activeVariant,
            color: color ? color : activeVariant.colors[0],
            price: activeVariant.discountPrice || activeVariant.price,
            quantity: 1,
        }
        addToCart(cartItem)
        toast.success("Added to cart", {
            duration: 5000,
        })
    }

    const handleAddToWishlist = (product: ProductWithRelations) => {
        addToWishlist(product)
        toast.success("Added to wishlist", {
            duration: 5000,
        })
    }

    return (
        <div className="md:col-span-2 space-y-4">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-accent-foreground">{product.name}</h1>
            <p className="text-sm text-muted-foreground truncate">{product?.shortDescription}</p>

            <div className="flex items-center gap-2">
                <Layers3 className="w-4 h-4 text-muted-foreground" />
                <Link href={`/products?category${product.category.id}`} className="text-sm text-primary hover:underline">{product.category.name}</Link>
            </div>
            <div className="flex items-center gap-x-2">
                <Rating style={{ maxWidth: 70 }} value={4.5} readOnly />
                <Separator orientation="vertical" className="h-4" />
                <p className="text-sm text-muted-foreground">({product.totalReview} reviews)</p>
            </div>
            <div className="flex items-center gap-x-2">
                <p className={cn("tracking-wider text-rose-500 text-xl", activeVariant.discountPrice && "line-through")}>৳{activeVariant.price}</p>
                <p className={cn("tracking-wider text-2xl", !activeVariant.discountPrice && "hidden")}>৳{activeVariant.discountPrice}</p>
                <p className={cn("tracking-wider text-sm text-green-500", !activeVariant.discountPrice && "hidden")}>
                    {
                        activeVariant.discountPrice && (
                            <>
                                {activeVariant.discount}% off
                            </>
                        )
                    }
                </p>
            </div>
            {
                activeVariant.stock > 0 ? (
                    <div className="flex items-center gap-x-2">
                        <Badge variant="default" className="rounded-full">In Stock</Badge>
                    </div>
                ) : (
                    <div className="flex items-center gap-x-2">
                        <Badge variant="destructive" className="rounded-full">Out of Stock</Badge>
                    </div>
                )
            }

            <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-accent-foreground">Sizes</p>
                <RadioGroup defaultValue={activeVariant.name} className="flex items-center gap-x-2">
                    {
                        product.variants.map((variant) => (
                            <div key={variant.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={variant.name} id={variant.id} onClick={() => setActiveVariant(variant)} />
                                <Label htmlFor={variant.id}>{variant.name}</Label>
                            </div>
                        ))
                    }
                </RadioGroup>
            </div>

            <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-accent-foreground">Colors</p>
                <RadioGroup defaultValue={color || activeVariant.colors[0]} className="flex items-center gap-x-2">
                    {
                        activeVariant.colors.map((color) => (
                            <div key={color} className="flex items-center space-x-2">
                                <RadioGroupItem value={color} id={color} onClick={() => setColor(color)} />
                                <Label htmlFor={color}>
                                    <div className="w-4 h-4" style={{ backgroundColor: color }} />
                                </Label>
                            </div>
                        ))
                    }
                </RadioGroup>
            </div>


            <div className="hidden md:flex items-center gap-x-6">
                <div className="flex items-center gap-x-2">
                    <Image src="/cod.jpg" alt="cod" width={25} height={25} />
                    <p className="text-sm text-muted-foreground">Cash on Delivery</p>
                </div>
                <div className="flex items-center gap-x-2">
                    <CornerDownLeft className="w-6 h-6" />
                    <p className="text-sm text-muted-foreground">7 Days Return</p>
                </div>
            </div>



            <div className="flex items-center gap-x-2">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="default" size="lg" className="px-5" onClick={handleAddToCart}>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                <span>Add to Cart</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add to cart</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Button variant="secondary" className="flex items-center gap-x-2" onClick={() => handleAddToWishlist(product)}>
                    <Heart className="w-4 h-4" />
                    <span className="hidden md:block">Add to Wishlist</span>
                </Button>
                <Button variant="secondary" className="flex items-center gap-x-2">
                    <Share2 className="w-4 h-4" />
                    <span className="hidden md:block">Share</span>
                </Button>
            </div>
        </div>
    )
}