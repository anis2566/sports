import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"

import { db } from "@/lib/db"
import { isAdmin } from "@/lib/session-middleware"
import { ProductSchema } from "../schema"

const app = new Hono()
    .get(
        "/categoryForSelect",
        zValidator("query", z.object({
            query: z.string().optional(),
        })),
        async (c) => {
            const { query } = c.req.valid("query")
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
            })
            return c.json(categories)
        }
    )
    .get(
        "/brandForSelect",
        zValidator("query", z.object({
            query: z.string().optional(),
        })),
        async (c) => {
            const { query } = c.req.valid("query")
            const brands = await db.brand.findMany({
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
            })
            return c.json(brands)
        }
    )
    .post(
        "/",
        isAdmin,
        zValidator("json", ProductSchema),
        async (c) => {
            const body = c.req.valid("json");
            try {
                const totalStock = body.variants.reduce((acc, variant) => acc + variant.stock, 0);

                const variantsData = body.variants.map((variant) => ({
                    name: variant.name,
                    stock: variant.stock,
                    colors: variant.colors,
                    price: variant.price,
                    discount: variant.discountPrice && variant.discountPrice > 0 ? (variant.price - variant.discountPrice) / variant.price : 0,
                    discountPrice: variant.discountPrice,
                    images: variant.images,
                }));

                await db.product.create({
                    data: {
                        name: body.name,
                        shortDescription: body.shortDescription,
                        description: body.description,
                        totalStock,
                        tags: body.tags,
                        brandId: body.brandId,
                        categoryId: body.categoryId,
                        variants: {
                            createMany: {
                                data: variantsData,
                            },
                        },
                    },
                });

                return c.json({ success: "Product created successfully" });
            } catch {
                return c.json({ error: "Failed to create product" }, 500);
            }
        }
    )
    .delete(
        "/delete/:id",
        isAdmin,
        zValidator("param", z.object({ id: z.string() })),
        async (c) => {
            const id = await c.req.param("id");

            try {
                const product = await db.product.findUnique({ where: { id } });

                if (!product) {
                    return c.json({ error: "Product not found" }, 404);
                }

                await db.product.delete({ where: { id } });

                return c.json({ success: "Product deleted" }, 200);
            } catch {
                return c.json({ error: "Failed to delete product" }, 500);
            }
        }
    )
    .get(
        "/",
        zValidator("query", z.object({
            query: z.string().optional(),
            page: z.string().optional(),
            limit: z.string().optional(),
            sort: z.string().optional(),
            category: z.string().optional(),
            brand: z.string().optional(),
            status: z.string().optional(),
        })),
        async (c) => {
            const { query, page, limit, sort, category, brand, status } = c.req.valid("query")

            const pageNumber = parseInt(page || "1");
            const limitNumber = parseInt(limit || "5");

            const [products, totalCount] = await Promise.all([
                db.product.findMany({
                    where: {
                        ...(query && { name: { contains: query, mode: "insensitive" } }),
                        ...(category && {
                            category: {
                                name: {
                                    contains: category,
                                    mode: "insensitive",
                                }
                            }
                        }),
                        ...(brand && {
                            brand: {
                                name: {
                                    contains: brand,
                                    mode: "insensitive",
                                }
                            }
                        }),
                        ...(status && { status: { equals: status } })
                    },
                    include: {
                        category: true,
                        brand: true,
                        variants: true,
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.product.count({
                    where: {
                        ...(query && { name: { contains: query, mode: "insensitive" } }),
                        ...(category && {
                            category: {
                                name: {
                                    contains: category,
                                    mode: "insensitive",
                                }
                            }
                        }),
                        ...(brand && {
                            brand: {
                                name: {
                                    contains: brand,
                                    mode: "insensitive",
                                }
                            }
                        }),
                        ...(status && { status })
                    },
                }),
            ]);

            console.log(products)

            return c.json({ products, totalCount });
        }
    )
    .get(
        "/relatedProducts/:id",
        zValidator("param", z.object({ id: z.string() })),
        async (c) => {
            const id = await c.req.param("id")
            const product = await db.product.findMany({
                where: {
                    categoryId: id
                },
                include: {
                    variants: true,
                    category: true
                },
                orderBy: {
                    totalSold: "desc"
                },
                take: 10
            })
            return c.json(product)
        }
    )
    .get(
        "/similarCategoryProducts/:id",
        zValidator("param", z.object({ id: z.string() })),
        async (c) => {
            const id = await c.req.param("id")
            const product = await db.product.findMany({
                where: {
                    categoryId: id
                },
                include: {
                    variants: true,
                    category: true
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 10
            })
            return c.json(product)
        }
    )

export default app
