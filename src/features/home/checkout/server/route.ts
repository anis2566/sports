import { zValidator } from "@hono/zod-validator";
import { Month } from "@prisma/client";
import { Hono } from "hono";

import { sessionMiddleware } from "@/lib/session-middleware";
import { OrderSchema } from "../schema";
import { db } from "@/lib/db";

const app = new Hono()
    .post(
        "/",
        sessionMiddleware,
        zValidator("json", OrderSchema),
        async (c) => {
            const body = await c.req.valid("json")
            const { userId } = c.get("user")

            try {

                const totalPrice = body.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
                const totalPaidAmount = totalPrice + body.shippingCharge

                const order = await db.order.create({
                    data: {
                        ...body,
                        userId,
                        month: Object.values(Month)[new Date().getMonth()],
                        totalPrice,
                        totalPaidAmount,
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
            } catch {
                return c.json({ error: "Internal server error" }, 500)
            }
        }
    )

export default app
