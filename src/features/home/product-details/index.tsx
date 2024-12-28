"use client"

import { Category, Variant, Product } from "@prisma/client"
import { useState } from "react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import { Images } from "./images"
import ProductInfo from "./product-info"
import { VariantWithExtended } from "@/hooks/use-cart"
import RelatedProducts from "./related-products"
import { DeliveryBanner } from "@/components/delivery-banner"
import { SimilarCategoryProducts } from "./similar-category-products"
import { Reviews } from "./reviews"
import { Questions } from "./questions"

interface ProductWithRelations extends Product {
    category: Category
    variants: Variant[]
}

interface Props {
    product: ProductWithRelations
}

export const ProductDetails = ({ product }: Props) => {

    const parsedProduct = {
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        category: {
            ...product.category,
            createdAt: product.category.createdAt.toISOString(),
            updatedAt: product.category.updatedAt.toISOString(),
        },
        variants: product.variants.map(variant => ({
            ...variant,
            createdAt: variant.createdAt.toISOString(),
            updatedAt: variant.updatedAt.toISOString(),
        })),
    }

    const [activeVariant, setActiveVariant] = useState<VariantWithExtended>(parsedProduct.variants[0])

    return (
        <div className="px-4 md:px-0 mt-4 space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
                <div className="md:col-span-3 grid md:grid-cols-3 gap-3 p-2 justify-items-center">
                    <Images images={activeVariant.images} />
                    <ProductInfo product={parsedProduct} activeVariant={activeVariant} setActiveVariant={setActiveVariant} />
                </div>
                <div className="p-2 border-l border-gray-200 dark:border-gray-800">
                    <RelatedProducts categoryId={parsedProduct.categoryId} />
                </div>
            </div>

            <DeliveryBanner />

            <Tabs defaultValue="summary" className="w-full">
                <TabsList className="w-full">
                    <TabsTrigger value="summary" className="px-1.5 md:px-3">Summary</TabsTrigger>
                    <TabsTrigger value="reviews" className="px-1.5 md:px-3">Reviews</TabsTrigger>
                    <TabsTrigger value="questions" className="px-1.5 md:px-3">Questions</TabsTrigger>
                </TabsList>
                <TabsContent value="summary">
                    <p>{parsedProduct.description}</p>
                </TabsContent>
                <TabsContent value="reviews">
                    <Reviews productId={parsedProduct.id} rating={parsedProduct.rating} totalReviews={parsedProduct.totalReview} />
                </TabsContent>
                <TabsContent value="questions">
                    <Questions productId={parsedProduct.id} />
                </TabsContent>
            </Tabs>

            <SimilarCategoryProducts categoryId={parsedProduct.categoryId} />
        </div>
    )
}