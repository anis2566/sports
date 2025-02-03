import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { ROLE } from "@/constant";
import { SellerSchema } from "@/features/seller/register/schema";
import { db } from "@/lib/db";
import { sessionMiddleware } from "@/lib/session-middleware";

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
export default app