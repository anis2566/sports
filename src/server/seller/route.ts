import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { ROLE, STATUS } from "@/constant";
import { SellerSchema } from "@/features/seller/register/schema";
import { db } from "@/lib/db";
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";
import { OrderSchema } from "@/features/seller/checkout/schema";

const app = new Hono()
    .post(
        "/register",
        sessionMiddleware,
        zValidator("json", SellerSchema),
        async (c) => {
            const { userId } = c.get("user");
            const body = await c.req.valid("json");

            try {
                const seller = await db.seller.findUnique({
                    where: {
                        userId
                    }
                })

                if (seller) {
                    return c.json({ error: "Seller already exists" }, 400);
                }

                await db.$transaction(async (tx) => {
                    await tx.seller.create({
                        data: {
                            ...body,
                            userId
                        }
                    })

                    await tx.user.update({
                        where: {
                            id: userId
                        },
                        data: {
                            role: ROLE.Seller
                        }
                    })
                })

                return c.json({ success: "Registration successful" }, 200);
            } catch (error) {
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .post(
        "/order",
        sessionMiddleware,
        zValidator("json", OrderSchema),
        async (c) => {
            const { userId } = c.get("user");
            const body = await c.req.valid("json");

            try {
                const seller = await db.seller.findUnique({
                    where: {
                        userId
                    }
                })

                if (!seller) {
                    return c.json({ error: "Seller not found" }, 404);
                }

                const totalPrice = body.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                const totalPaidAmount = totalPrice + body.shippingCharge;

                await db.sellerOrder.create({
                    data: {
                        totalPrice,
                        shippingCharge: body.shippingCharge,
                        totalPaidAmount,
                        sellerId: seller.id,
                        orderItems: {
                            create: body.orderItems
                        }
                    }
                })

                return c.json({ success: "Order placed" }, 200);
            } catch (error) {
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .get(
        "/request",
        isAdmin,
        zValidator("query", z.object({
            query: z.string().optional(),
            page: z.string().optional(),
            limit: z.string().optional(),
            sort: z.string().optional(),
        })),
        async (c) => {
            const { query, page, limit, sort } = await c.req.valid("query");

            const pageNumber = parseInt(page || "1");
            const limitNumber = parseInt(limit || "5");

            const [sellers, totalCount] = await Promise.all([
                db.seller.findMany({
                    where: {
                        ...(query && { name: { contains: query, mode: "insensitive" } }),
                        status: STATUS.Pending
                    },
                    include: {
                        user: true
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.seller.count({
                    where: {
                        ...(query && { name: { contains: query, mode: "insensitive" } }),
                    },
                }),
            ])

            return c.json({ sellers, totalCount }, 200);
        }
    )
    .put(
        "/status/:id",
        isAdmin,
        zValidator("param", z.object({
            id: z.string()
        })),
        zValidator("json", z.object({
            status: z.enum([STATUS.Pending, STATUS.Active, STATUS.Inactive])
        })),
        async (c) => {
            const { id } = await c.req.valid("param");
            const body = await c.req.valid("json");

            try {
                const seller = await db.seller.findUnique({
                    where: { id }
                })

                if (!seller) {
                    return c.json({ error: "Seller not found" }, 404);
                }

                await db.seller.update({
                    where: { id },
                    data: { status: body.status }
                })

                return c.json({ success: "Status updated" }, 200);
            } catch (error) {
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .delete(
        "/:id",
        isAdmin,
        zValidator("param", z.object({
            id: z.string()
        })),
        async (c) => {
            const { id } = await c.req.valid("param");

            try {
                const seller = await db.seller.findUnique({
                    where: { id }
                })

                if (!seller) {
                    return c.json({ error: "Seller not found" }, 404);
                }

                await db.$transaction(async (tx) => {
                    await tx.seller.delete({
                        where: { id }
                    })

                    await tx.user.update({
                        where: { id: seller.userId },
                        data: { role: ROLE.User }
                    })
                })

                return c.json({ success: "Seller deleted" }, 200);
            } catch (error) {
                return c.json({ error: "Internal server error" }, 500);
            }
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
            status: z.enum([STATUS.Pending, STATUS.Active, STATUS.Inactive]).optional(),
        })),
        async (c) => {
            const { query, page, limit, sort, status } = await c.req.valid("query");

            const pageNumber = parseInt(page || "1");
            const limitNumber = parseInt(limit || "5");

            const [sellers, totalCount] = await Promise.all([
                db.seller.findMany({
                    where: {
                        ...(query && { name: { contains: query, mode: "insensitive" } }),
                        ...(status ? { status: status } : {status: STATUS.Active}),
                    },
                    include: {
                        user: true,
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.seller.count({
                    where: {
                        ...(query && { name: { contains: query, mode: "insensitive" } }),
                        ...(status && { status: status }),
                    },
                }),
            ])

            return c.json({ sellers, totalCount }, 200);
        }
    )
export default app