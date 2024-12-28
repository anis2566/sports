import { z } from "zod";

export const ReviewSchema = z.object({
  rating: z.number().min(1, { message: "required" }),
  content: z.string().min(10, { message: "required" }),
});

export type ReviewSchemaType = z.infer<typeof ReviewSchema>;

export const QuestionSchema = z.object({
  question: z.string().min(10, { message: "required" }),
  productId: z.string().min(1, { message: "required" }),
});

export type QuestionSchemaType = z.infer<typeof QuestionSchema>;