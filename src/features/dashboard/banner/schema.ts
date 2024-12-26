import { PRODUCT_STATUS } from "@/constant";
import { z } from "zod";

export const BannerSchema = z.object({
  imageUrl: z.string().min(1, { message: "required" }),
  status: z
    .nativeEnum(PRODUCT_STATUS)
    .refine((data) => Object.values(PRODUCT_STATUS).includes(data), {
      message: "required",
    }),
});

export type BannerSchemaType = z.infer<typeof BannerSchema>;
