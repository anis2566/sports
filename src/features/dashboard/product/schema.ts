import { z } from "zod";

const requiredString = z.string().min(1, { message: "required" })

const ProductVariantSchema = z.object({
    name: requiredString,
    stock: z.number().min(1, { message: "required" }),
    colors: z.array(z.string()).optional(),
    images: z.array(z.string()).min(1, { message: "required" }),
    price: z.number().min(1, { message: "required" }),
    discountPrice: z.number().optional(),
})

export const ProductSchema = z.object({
    name: requiredString,
    shortDescription: z.string().optional(),
    description: requiredString,
    brandId: requiredString,
    categoryId: requiredString,
    tags: z.array(z.string()).optional(),

    variants: z.array(ProductVariantSchema).min(1, { message: "required" }),
})

export type ProductSchemaType = z.infer<typeof ProductSchema>

