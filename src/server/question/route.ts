import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { QuestionSchema } from "@/features/home/products/schemas";
import { db } from "@/lib/db";
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
    .post(
        "/:id",
        sessionMiddleware,
        zValidator("param", z.object({ id: z.string() })),
        zValidator("json", QuestionSchema),
        async (c) => {
            const { id } = c.req.valid("param");
            const { question, productId } = c.req.valid("json");
            const { userId } = c.get("user");
            try {
                const product = await db.product.findUnique({
                    where: { id },
                });

                if (!product) {
                    return c.json({ error: "Product not found" }, 404);
                }

                await db.question.create({
                    data: { question, productId, userId },
                });

                return c.json({ success: "Question added" });
            } catch (error) {
                console.log(error);
                return c.json({ error: "Failed to add question" }, 500);
            }
        }
    )
    .get(
        "/user",
        sessionMiddleware,
        zValidator("query", z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
            sort: z.string().optional(),
        })),
        async (c) => {
            const { userId } = c.get("user");
            const { page, limit, sort } = c.req.valid("query");

            const pageNumber = parseInt(page || "1");
            const limitNumber = parseInt(limit || "5");

            const [questions, totalCount] = await Promise.all([
                db.question.findMany({
                    where: {
                        userId,
                    },
                    include: {
                        product: true,
                        answers: {
                            select: {
                                id: true,
                                answer: true,
                                createdAt: true,
                            }
                        }
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.question.count({
                    where: {
                        userId,
                    },
                }),
            ]);

            return c.json({ questions, totalCount });
        }
    )
    .get(
        "/",
        isAdmin,
        zValidator("query", z.object({
            query: z.string().optional(),
            page: z.string().optional(),
            limit: z.string().optional(),
            sort: z.string().optional(),
        })),
        async (c) => {
            const { query, page, limit, sort } = c.req.valid("query");

            const pageNumber = parseInt(page || "1");
            const limitNumber = parseInt(limit || "5");

            const [questions, totalCount] = await Promise.all([
                db.question.findMany({
                    where: {
                        ...(query && {
                            product: {
                                name: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                        })
                    },
                    include: {
                        product: true,
                        user: true,
                        answers: {
                            select: {
                                id: true,
                            }
                        }
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.question.count({
                    where: {
                        ...(query && {
                            product: {
                                name: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                        }),
                    },
                }),
            ]);

            return c.json({ questions, totalCount });
        }
    )
    .delete(
        "/:id",
        isAdmin,
        zValidator("param", z.object({ id: z.string() })),
        async (c) => {
            const id = await c.req.param("id");

            try {
                const question = await db.question.findUnique({ where: { id }, include: { product: true } });

                if (!question) {
                    return c.json({ error: "Question not found" }, 404);
                }

                await db.question.delete({ where: { id } });

                return c.json({ success: "Question deleted" }, 200);
            } catch {
                return c.json({ error: "Failed to delete question" }, 500);
            }
        }
    )
    .get(
        "/:productId",
        zValidator("param", z.object({ productId: z.string() })),
        zValidator("query", z.object({ cursor: z.string().optional() })),
        async (c) => {
            const { productId } = c.req.valid("param");
            const { cursor } = c.req.valid("query") || undefined;

            const pageSize = 3;

            const questions = await db.question.findMany({
                where: { productId: productId },
                include: {
                    user: true,
                    answers: {
                        include: {
                            user: true,
                        }
                    }
                },
                orderBy: { createdAt: "desc" },
                take: -pageSize - 1,
                cursor: cursor ? { id: cursor } : undefined,
            });

            const previousCursor = questions.length > pageSize ? questions[0].id : null;

            const data = {
                questions: questions.length > pageSize ? questions.slice(1) : questions,
                previousCursor,
            };

            return c.json(data);
        }
    )

export default app;
