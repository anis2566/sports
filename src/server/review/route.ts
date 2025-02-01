import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { ReviewSchema } from "@/features/home/products/schemas";
import { db } from "@/lib/db";
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";
import { ORDER_STATUS } from "@/constant";

const app = new Hono()
    .post(
        "/:productId",
        sessionMiddleware,
        zValidator("param", z.object({ productId: z.string() })),
        zValidator("json", ReviewSchema),
        async (c) => {
            const { productId } = c.req.valid("param");
            const { rating, content } = c.req.valid("json");
            const { userId } = c.get("user");
            try {
                const isBougth = await db.order.findFirst({
                    where: {
                        userId: userId,
                        orderItems: {
                            some: {
                                productId: productId,
                            },
                        },
                        status: ORDER_STATUS.Delivered,
                    },
                });

                if (!isBougth) {
                    return c.json({ error: "You must buy this product to review" }, 400);
                }

                const isReviewed = await db.review.findFirst({
                    where: {
                        userId: userId,
                        productId: productId,
                    },
                });

                if (isReviewed) {
                    return c.json(
                        { error: "You have already reviewed this product" },
                        400
                    );
                }

                await db.review.create({
                    data: { rating, content, productId: productId, userId },
                });

                const product = await db.product.findUnique({
                    where: { id: productId },
                });

                if (!product) {
                    return c.json({ error: "Product not found" }, 404);
                }

                const currentTotalReview = product.totalReview;
                const currentRating = product.rating || 0;

                const newTotalReview = currentTotalReview + 1;
                const newRating =
                    Math.floor(
                        ((currentRating * currentTotalReview + rating) / newTotalReview) * 2
                    ) / 2;

                await db.product.update({
                    where: { id: productId },
                    data: { totalReview: { increment: 1 }, rating: newRating },
                });

                return c.json({ success: "Review added" });
            } catch (error) {
                console.log(error);
                return c.json({ error: "Failed to add review" }, 500);
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

            const reviews = await db.review.findMany({
                where: { productId: productId },
                include: {
                    user: true,
                },
                orderBy: { createdAt: "desc" },
                take: -pageSize - 1,
                cursor: cursor ? { id: cursor } : undefined,
            });

            const previousCursor = reviews.length > pageSize ? reviews[0].id : null;

            const data = {
                reviews: reviews.length > pageSize ? reviews.slice(1) : reviews,
                previousCursor,
            };

            return c.json(data);
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

            const [reviews, totalCount] = await Promise.all([
                db.review.findMany({
                    where: {
                        userId,
                    },
                    include: {
                        product: true,
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.review.count({
                    where: {
                        userId,
                    },
                }),
            ]);

            return c.json({ reviews, totalCount });
        }
    )
    .get(
        "/user/notReviewed",
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

            const [products, totalCount] = await Promise.all([
                db.product.findMany({
                    where: {
                        orderItems: {
                            some: {
                                order: {
                                    userId,
                                    status: ORDER_STATUS.Delivered,
                                },
                                product: {
                                    reviews: {
                                        none: {
                                            userId,
                                        },
                                    },
                                },
                            },
                        }
                    },
                    include: {
                        orderItems: {
                            include: {
                                order: true,
                            },
                        },
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.product.count({
                    where: {
                        orderItems: {
                            some: {
                                order: {
                                    userId,
                                    status: ORDER_STATUS.Delivered,
                                },
                                product: {
                                    reviews: {
                                        none: {
                                            userId,
                                        },
                                    },
                                },
                            },
                        }
                    },
                }),
            ]);

            return c.json({ products, totalCount });
        }
    )
    .get(
        "/top/:productId",
        zValidator("param", z.object({ productId: z.string() })),
        async (c) => {
            const { productId } = c.req.valid("param");
            const reviews = await db.review.findMany({
                where: {
                    productId: productId,
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                        }
                    },
                },
                orderBy: [
                    { rating: "asc" },
                    { createdAt: "desc" },
                ],
                take: 5,
            });
            return c.json(reviews);
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

            const [reviews, totalCount] = await Promise.all([
                db.review.findMany({
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
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.review.count({
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

            return c.json({ reviews, totalCount });
        }
    )
    .delete(
        "/:id",
        isAdmin,
        zValidator("param", z.object({ id: z.string() })),
        async (c) => {
            const id = await c.req.param("id");

            try {
                const review = await db.review.findUnique({ where: { id }, include: { product: true } });

                if (!review) {
                    return c.json({ error: "Review not found" }, 404);
                }

                await db.review.delete({ where: { id } });

                const product = await db.product.findUnique({
                    where: { id: review.productId },
                    include: {
                        reviews: true,
                    },
                });

                if (!product) {
                    return c.json({ error: "Product not found" }, 404);
                }

                const remainingReviews = product.reviews;
                const newTotalReview = remainingReviews.length;

                let newRating = 0;
                if (newTotalReview > 0) {
                    const totalRating = remainingReviews.reduce(
                        (sum, r) => sum + r.rating,
                        0
                    );
                    newRating = Math.floor((totalRating / newTotalReview) * 2) / 2;
                }

                await db.product.update({
                    where: { id: review.productId },
                    data: { totalReview: newTotalReview, rating: newRating },
                });

                return c.json({ success: "Review deleted" }, 200);
            } catch {
                return c.json({ error: "Failed to delete review" }, 500);
            }
        }
    )

export default app;
