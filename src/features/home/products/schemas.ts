import { z } from "zod";

export const ReviewSchema = z.object({
  rating: z.number().min(1, { message: "required" }),
  content: z.string().min(10, { message: "required" }),
});

export type ReviewSchemaType = z.infer<typeof ReviewSchema>;
