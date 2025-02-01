import { Hono } from "hono"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"
import { Month } from "@prisma/client"

import { db } from "@/lib/db"
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware"
import { ORDER_STATUS } from "@/constant"
import { OrderSchema } from "@/features/home/checkout/schema"

const app = new Hono()
    .post(
        "/",
        sessionMiddleware,
        zValidator("json", OrderSchema),
        async (c) => {
            const body = await c.req.valid("json")
            const { userId } = c.get("user")

            try {

                const totalPrice = body.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0
                const totalPaidAmount = totalPrice + body.shippingCharge || 0

                const order = await db.order.create({
                    data: {
                        name: body.name,
                        phone: body.phone,
                        altPhone: body.altPhone,
                        address: body.address,
                        shippingCharge: body.shippingCharge,
                        userId,
                        month: Object.values(Month)[new Date().getMonth()],
                        totalPrice,
                        totalPaidAmount,
                        cityId: body.cityId,
                        areaId: body.areaId,
                        paymentMethod: body.paymentMethod,
                        orderItems: {
                            createMany: {
                                data: body.orderItems.map((item) => ({
                                    productId: item.productId,
                                    quantity: item.quantity,
                                    price: item.price,
                                    variantId: item.variantId,
                                    color: item.color,
                                }))
                            }
                        }
                    }
                })

                for (const item of body.orderItems) {
                    await db.$transaction(async (tx) => {
                        await tx.variant.update({
                            where: { id: item.variantId },
                            data: {
                                stock: { decrement: item.quantity }
                            }
                        })
                        await tx.product.update({
                            where: { id: item.productId },
                            data: {
                                totalSold: { increment: item.quantity },
                                totalStock: { decrement: item.quantity }
                            }
                        })
                    })
                }

                return c.json({ success: "Order placed", id: order.id })
            } catch (error) {
                console.log(error)
                return c.json({ error: "Internal server error" }, 500)
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
            status: z.string().optional(),
        })),
        async (c) => {
            const { page, limit, sort, status } = c.req.valid("query");
            const { userId } = c.get("user");

            const pageNumber = parseInt(page || "1");
            const limitNumber = parseInt(limit || "5");

            const [orders, totalCount] = await Promise.all([
                db.order.findMany({
                    where: {
                        ...(status && { status }),
                        userId: userId,
                    },
                    include: {
                        orderItems: {
                            include: {
                                product: true,
                            },
                        },
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.order.count({
                    where: {
                        ...(status && { status }),
                        userId: userId,
                    },
                }),
            ]);

            return c.json({ orders, totalCount });
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
            phone: z.string().optional(),
            status: z.string().optional(),
            paymentStatus: z.string().optional(),
        })),
        async (c) => {
            const { query, page, limit, sort, phone, status, paymentStatus } = c.req.valid("query")

            const pageNumber = parseInt(page || "1");
            const limitNumber = parseInt(limit || "5");

            const [orders, totalCount] = await Promise.all([
                db.order.findMany({
                    where: {
                        ...(query && { name: { contains: query, mode: "insensitive" } }),
                        ...(phone && { phone: { contains: phone, mode: "insensitive" } }),
                        ...(status && { status }),
                        ...(paymentStatus && { paymentStatus }),
                    },
                    include: {
                        user: true,
                        orderItems: {
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
                db.order.count({
                    where: {
                        ...(query && { name: { contains: query, mode: "insensitive" } }),
                        ...(phone && { phone: { contains: phone, mode: "insensitive" } }),
                        ...(status && { status }),
                        ...(paymentStatus && { paymentStatus }),
                    },
                }),
            ])

            return c.json({ orders, totalCount })
        }
    )
    .put(
        "/:id",
        isAdmin,
        zValidator("param", z.object({ id: z.string() })),
        zValidator("json", z.object({ status: z.nativeEnum(ORDER_STATUS) })),
        async (c) => {
            const { id } = c.req.valid("param")
            const { status } = c.req.valid("json")

            try {
                const order = await db.order.findUnique({ where: { id }, include: { orderItems: true } })
                if (!order) {
                    return c.json({ error: "Order not found" }, 404)
                }

                if (status === ORDER_STATUS.Cancelled) {
                    for (const item of order.orderItems) {
                        await db.$transaction(async (tx) => {
                            await tx.variant.update({
                                where: { id: item.variantId },
                                data: {
                                    stock: { increment: item.quantity }
                                }
                            })
                            await db.product.update({
                                where: { id: item.productId },
                                data: {
                                    totalSold: { decrement: item.quantity },
                                    totalStock: { increment: item.quantity }
                                }
                            })
                        })
                    }
                }

                await db.order.update({ where: { id }, data: { status } })

                return c.json({ success: "Order status updated" })

            } catch {
                return c.json({ error: "Failed to update order status" }, 500)
            }
        }
    )
    .delete(
        "/:id",
        isAdmin,
        zValidator("param", z.object({ id: z.string() })),
        async (c) => {
            const id = await c.req.param("id");

            try {
                const order = await db.order.findUnique({ where: { id } });

                if (!order) {
                    return c.json({ error: "Order not found" }, 404);
                }

                await db.order.delete({ where: { id } });

                return c.json({ success: "Order deleted" }, 200);
            } catch {
                return c.json({ error: "Failed to delete order" }, 500);
            }
        }
    )

export default app
