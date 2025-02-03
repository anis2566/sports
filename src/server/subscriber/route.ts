import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { db } from "@/lib/db";
import { isAdmin } from "@/lib/session-middleware";

const app = new Hono()
    .post(
        "/",
        zValidator(
            "json",
            z.object({
                email: z.string().email(),
            })
        ),
        async (c) => {
            const { email } = c.req.valid("json");

            try {
                const subscriber = await db.subscriber.findUnique({
                    where: {
                        email,
                    },
                });

                if (subscriber) {
                    return c.json({ error: "Already subscribed" }, 400);
                }

                await db.subscriber.create({
                    data: { email },
                });

                return c.json({ success: "Subscribed" }, 200);
            } catch (error) {
                return c.json({ error: "Failed to subscribe" }, 500);
            }
        }
    )
    .get(
        "/",
        isAdmin,
        zValidator(
            "query",
            z.object({
                query: z.string().optional(),
                page: z.string().optional(),
                limit: z.string().optional(),
                sort: z.string().optional(),
            })
        ),
        async (c) => {
            const { query, page, limit, sort } = c.req.valid("query");

            const pageNumber = parseInt(page || "1");
            const limitNumber = parseInt(limit || "5");

            const [subscribers, totalCount] = await Promise.all([
                db.subscriber.findMany({
                    where: {
                        ...(query && { email: { contains: query, mode: "insensitive" } }),
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.subscriber.count({
                    where: {
                        ...(query && { email: { contains: query, mode: "insensitive" } }),
                    },
                }),
            ]);
            return c.json({ subscribers, totalCount });
        }
    )
    .delete(
        "/:id",
        isAdmin,
        zValidator("param", z.object({ id: z.string() })),
        async (c) => {
            const id = await c.req.param("id");

            try {
                const subscriber = await db.subscriber.findUnique({ where: { id } });

                if (!subscriber) {
                    return c.json({ error: "Subscriber not found" }, 404);
                }

                await db.subscriber.delete({ where: { id } });

                return c.json({ success: "Subscriber deleted" }, 200);
            } catch {
                return c.json({ error: "Failed to delete subscriber" }, 500);
            }
        }
    )

export default app;
