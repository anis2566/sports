import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { db } from "@/lib/db";

const app = new Hono()
    .get(
        "/cities",
        async (c) => {
            const data = await db.city.findMany({
                orderBy: {
                    cityId: "asc"
                }
            })
            return c.json(data)
        }
    )
    .get(
        "/areas",
        zValidator("query", z.object({
            cityId: z.string().optional()
        })),
        async (c) => {
            const { cityId } = await c.req.valid("query")

            if (!cityId) {
                return c.json([])
            }

            const data = await db.area.findMany({
                where: {
                    cityId
                },
                orderBy: {
                    areaId: "asc"
                }
            })
            return c.json(data)
        }
    )
    .get(
        "/zones",
        zValidator("query", z.object({
            areaId: z.string().optional()
        })),
        async (c) => {
            const { areaId } = await c.req.valid("query")

            if (!areaId) {
                return c.json([])
            }

            const data = await db.zone.findMany({
                where: {
                    areaId
                },
                orderBy: {
                    zoneId: "asc"
                }
            })
            return c.json(data)
        }
    )

export default app