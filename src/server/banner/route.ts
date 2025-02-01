import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { isAdmin } from "@/lib/session-middleware";
import { BannerSchema } from "@/features/dashboard/banner/schema";
import { db } from "@/lib/db";
import { PRODUCT_STATUS } from "@/constant";

const app = new Hono()
    .post("/", isAdmin, zValidator("json", BannerSchema), async (c) => {
        const body = await c.req.valid("json");

        try {
            await db.banner.create({
                data: {
                    ...body,
                },
            });

            return c.json({ success: "Banner created" }, 200);
        } catch {
            return c.json({ error: "Failed to create banner" }, 500);
        }
    })
    .get("/home", async (c) => {
        const banners = await db.banner.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return c.json({
            banners,
        });
    })
    .get("/", async (c) => {
        const banners = await db.banner.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return c.json({ banners });
    })
    .put(
        "/:id",
        isAdmin,
        zValidator(
            "json",
            z.object({
                status: z.nativeEnum(PRODUCT_STATUS),
            })
        ),
        async (c) => {
            const body = await c.req.valid("json");
            const id = c.req.param("id");

            try {
                await db.banner.update({ where: { id }, data: body });
                return c.json({ success: "Banner updated" }, 200);
            } catch {
                return c.json({ error: "Failed to update banner" }, 500);
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
                const banner = await db.banner.findUnique({ where: { id } });

                if (!banner) {
                    return c.json({ error: "Banner not found" }, 404);
                }

                await db.banner.delete({ where: { id } });

                return c.json({ success: "Banner deleted" }, 200);
            } catch {
                return c.json({ error: "Failed to delete banner" }, 500);
            }
        }
    );

export default app;
