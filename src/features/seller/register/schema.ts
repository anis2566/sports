import { z } from "zod";

const requiredString = z.string().min(1, { message: "required" });

export const SellerSchema = z.object({
    name: requiredString,
    businessName: requiredString,
    phone: requiredString,
    email: requiredString,
    address: requiredString,
    bio: requiredString,
    documentUrl: requiredString,
    imageUrl: requiredString,
})

export type SellerSchemaType = z.infer<typeof SellerSchema>