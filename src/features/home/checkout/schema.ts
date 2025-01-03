import { PAYMENT_METHOD } from "@/constant";
import { z } from "zod";

const requiredString = z.string().min(1, { message: "required" });

const OrderItemSchema = z.object({
    productId: requiredString,
    quantity: z.number().min(1, { message: "required" }),
    price: z.number().min(1, { message: "required" }),
    color: z.string().optional(),
    variantId: requiredString,
});

export const OrderSchema = z.object({
    name: requiredString,
    phone: requiredString.length(11, { message: "invalid phone number" }),
    altPhone: z.string().optional(),
    cityId: requiredString,
    areaId: requiredString,
    zoneId: z.string().optional(),
    address: requiredString,
    shippingCharge: z.number().min(1, { message: "required" }),
    orderItems: z.array(OrderItemSchema),
    paymentMethod: z
        .nativeEnum(PAYMENT_METHOD)
        .refine((data) => Object.values(PAYMENT_METHOD).includes(data), {
            message: "required",
        }),
});

export type OrderSchemaType = z.infer<typeof OrderSchema>;