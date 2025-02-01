import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/lib/db";
import { isAdmin } from "@/lib/session-middleware";
import { CategorySchema } from "@/features/dashboard/category/schemas";
import { CATEGORY_STATUS } from "@/constant";

const app = new Hono()
    .post(
        "/",
        isAdmin,
        zValidator("json", CategorySchema),
        async (c) => {
            const { name, description, imageUrl, status, tags } = await c.req.valid(
                "json"
            );

            try {
                const category = await db.category.findFirst({
                    where: {
                        name: name,
                    },
                });

                if (category) {
                    return c.json({ error: "Category already exists" }, 400);
                }

                await db.category.create({
                    data: {
                        name,
                        description,
                        imageUrl,
                        status,
                        tags,
                    },
                });

                return c.json({ success: "Category created" }, 200);
            } catch {
                return c.json({ error: "Failed to create category" }, 500);
            }
        }
    )
    .put(
        "/:id",
        isAdmin,
        zValidator("param", z.object({ id: z.string() })),
        zValidator("json", CategorySchema),
        async (c) => {
            const id = await c.req.param("id");
            const { name, description, imageUrl, status, tags } = await c.req.valid(
                "json"
            );

            try {
                const category = await db.category.findUnique({
                    where: { id },
                });

                if (!category) {
                    return c.json({ error: "Category not found" }, 404);
                }

                await db.category.update({
                    where: { id },
                    data: { name, description, imageUrl, status, tags },
                });

                return c.json({ success: "Category edited" }, 200);
            } catch {
                return c.json({ error: "Failed to edit category" }, 500);
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
                const category = await db.category.findUnique({ where: { id } });

                if (!category) {
                    return c.json({ error: "Category not found" }, 404);
                }

                await db.category.delete({ where: { id } });

                return c.json({ success: "Category deleted" }, 200);
            } catch {
                return c.json({ error: "Failed to delete category" }, 500);
            }
        }
    )
    .get("/home", async (c) => {
        const categories = await db.category.findMany({
            where: {
                status: CATEGORY_STATUS.Active
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 20,
        });
        return c.json({
            categories,
        });
    })
    .get("/home/top", async (c) => {
        const categories = await db.category.findMany({
            where: {
                status: CATEGORY_STATUS.Active
            },
            orderBy: {
                products: {
                    _count: "desc",
                },
            },
            take: 20,
        });
        return c.json({
            categories,
        });
    })
    .get(
        "/home/featured",
        async (c) => {
          const categories = await db.category.findMany({
            where: {
              status: CATEGORY_STATUS.Active,
              // isFeatured: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
          });
          return c.json({
            categories,
          });
        }
      )
    .get(
        "/forSelect",
        zValidator(
            "query",
            z.object({
                query: z.string().optional(),
            })
        ),
        async (c) => {
            const { query } = c.req.valid("query");
            const categories = await db.category.findMany({
                where: {
                    ...(query && {
                        name: {
                            contains: query,
                            mode: "insensitive",
                        },
                    }),
                },
                select: {
                    id: true,
                    name: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
                take: 5,
            });
            return c.json(categories);
        }
    )
    .get(
        "/",
        zValidator(
            "query",
            z.object({
                query: z.string().optional(),
                page: z.string().optional(),
                limit: z.string().optional(),
                sort: z.string().optional(),
                status: z.string().optional(),
            })
        ),
        async (c) => {
            const { query, page, limit, sort, status } = await c.req.valid("query");

            const pageNumber = parseInt(page || "1");
            const limitNumber = parseInt(limit || "5");

            const [categories, totalCount] = await Promise.all([
                db.category.findMany({
                    where: {
                        ...(query && { name: { contains: query, mode: "insensitive" } }),
                        ...(status && { status: status }),
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.category.count({
                    where: {
                        ...(query && { name: { contains: query, mode: "insensitive" } }),
                        ...(status && { status: status }),
                    },
                }),
            ]);

            return c.json({ categories, totalCount });
        }
    )
export default app;
