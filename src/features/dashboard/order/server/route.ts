import { Hono } from "hono"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"

import { db } from "@/lib/db"
import { isAdmin } from "@/lib/session-middleware"
import { ORDER_STATUS } from "@/constant"

const app = new Hono()
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
                const order = await db.order.findUnique({ where: { id } })
                if (!order) {
                    return c.json({ error: "Order not found" }, 404)
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
