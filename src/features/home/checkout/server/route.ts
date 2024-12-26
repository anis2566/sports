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

                await db.order.create({
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

                return c.json({ success: "Order placed" })
            } catch {
                return c.json({ error: "Internal server error" }, 500)
            }
        }
    )

export default app
