import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { db } from "@/lib/db";
import { isAdmin } from "@/lib/session-middleware";
import { ProductSchema } from "@/features/dashboard/product/schema";
import { PRODUCT_STATUS } from "@/constant";

const app = new Hono()
    .post("/", isAdmin, zValidator("json", ProductSchema), async (c) => {
        const body = c.req.valid("json");
        try {
            const totalStock = body.variants.reduce(
                (acc, variant) => acc + variant.stock,
                0
            );

            const discountPercent = body.variants[0].discountPrice
                ? ((body.variants[0].price - body.variants[0].discountPrice) / body.variants[0].price) * 100
                : 0;

            const variantsData = body.variants.map((variant) => ({
                name: variant.name,
                stock: variant.stock,
                colors: variant.colors,
                price: variant.price,
                discount:
                    variant.discountPrice && variant.discountPrice > 0 && variant.price > 0
                        ? ((variant.price - variant.discountPrice) / variant.price) * 100
                        : 0,
                sellerPrice: variant.sellerPrice,
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
                    price: body.variants[0].price,
                    discount: discountPercent,
                    discountPrice: body.variants[0].discountPrice,
                    sellerPrice: body.variants[0].sellerPrice,
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
    })
    .put("/:id", isAdmin, zValidator("json", ProductSchema), async (c) => {
        const productId = c.req.param("id");
        const body = c.req.valid("json");

        try {
            const totalStock = body.variants.reduce(
                (acc, variant) => acc + variant.stock,
                0
            );

            const discountPercent = body.variants[0].discountPrice
                ? ((body.variants[0].price - body.variants[0].discountPrice) / body.variants[0].price) * 100
                : 0;

            const variantsData = body.variants.map((variant) => ({
                name: variant.name,
                stock: variant.stock,
                colors: variant.colors,
                price: variant.price,
                discount:
                    variant.discountPrice && variant.discountPrice > 0 && variant.price > 0
                        ? ((variant.price - variant.discountPrice) / variant.price) * 100
                        : 0,
                sellerPrice: variant.sellerPrice,
                discountPrice: variant.discountPrice,
                images: variant.images,
            }));

            await db.product.update({
                where: { id: productId },
                data: {
                    name: body.name,
                    shortDescription: body.shortDescription,
                    description: body.description,
                    totalStock,
                    tags: body.tags,
                    brandId: body.brandId,
                    categoryId: body.categoryId,
                    price: body.variants[0].price,
                    discount: discountPercent,
                    discountPrice: body.variants[0].discountPrice,
                    sellerPrice: body.variants[0].sellerPrice,
                },
            });

            await db.variant.deleteMany({ where: { productId } });
            await db.variant.createMany({
                data: variantsData.map((variant) => ({
                    ...variant,
                    productId,
                })),
            });

            return c.json({ success: "Product updated successfully" });
        } catch {
            return c.json({ error: "Failed to update product" }, 500);
        }
    })
    .put(
        "/:id/toggleGenre",
        isAdmin,
        zValidator("param", z.object({ id: z.string() })),
        zValidator("json", z.object({ genre: z.string(), status: z.boolean() })),
        async (c) => {
            const productId = c.req.param("id");
            const body = c.req.valid("json");

            try {
                const product = await db.product.findUnique({ where: { id: productId } });

                if (!product) {
                    return c.json({ error: "Product not found" }, 404);
                }

                if (body.status) {
                    await db.product.update({ where: { id: productId }, data: { genre: { push: body.genre } } });
                } else {
                    await db.product.update({ where: { id: productId }, data: { genre: { set: product.genre.filter((g) => g !== body.genre) } } });
                }

                return c.json({ success: "Genre toggled" });
            } catch (error) {
                console.log(error);
                return c.json({ error: "Failed to toggle genre" }, 500);
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
        "/relatedProducts/:id",
        zValidator("param", z.object({ id: z.string() })),
        async (c) => {
            const id = await c.req.param("id");
            const product = await db.product.findMany({
                where: {
                    categoryId: id,
                },
                include: {
                    variants: true,
                    category: true,
                },
                orderBy: {
                    totalSold: "desc",
                },
                take: 10,
            });
            return c.json(product);
        }
    )
    .get(
        "/similarCategoryProducts/:id",
        zValidator("param", z.object({ id: z.string() })),
        async (c) => {
            const id = await c.req.param("id");
            const product = await db.product.findMany({
                where: {
                    categoryId: id,
                },
                include: {
                    variants: true,
                    category: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 10,
            });
            return c.json(product);
        }
    )
    .get(
        "/home",
        zValidator("query", z.object({
            cursor: z.string().optional(),
            query: z.string().optional(),
            sort: z.string().optional(),
            inStock: z.string().optional(),
            priceMin: z.string().optional(),
            priceMax: z.string().optional(),
            discountMin: z.string().optional(),
            discountMax: z.string().optional(),
            discount: z.string().optional(),
            rating: z.string().optional(),
            category: z.string().optional(),
            brand: z.string().optional(),
            genre: z.string().optional(),
        })),
        async (c) => {
            const { cursor, query, sort, inStock, priceMin, priceMax, discountMin, discountMax, discount, rating, category, brand, genre } = c.req.valid("query");

            const pageSize = 8;

            const products = await db.product.findMany({
                where: {
                    ...(query && { name: { contains: query, mode: "insensitive" } }),
                    ...(inStock && { totalStock: { gt: 0 } }),
                    ...(priceMin && priceMax !== undefined && { price: { gte: Number(priceMin), lte: Number(priceMax) } }),
                    ...(discountMin && discountMax !== undefined && { discount: { gte: Number(discountMin), lte: Number(discountMax) } }),
                    ...(discount && { discount: { gt: 0 } }),
                    ...(rating && { rating: { gte: Number(rating) } }),
                    ...(category && { categoryId: category }),
                    ...(brand && { brandId: brand }),
                    ...(genre && { genre: { has: genre } }),
                },
                include: {
                    variants: true,
                    category: true,
                },
                orderBy: {
                    ...(sort === "desc" && { createdAt: "desc" }),
                    ...(sort === "b_desc" && { createdAt: "desc" }),
                    ...(sort === "total_sell_asc" && { totalSold: "asc" }),
                    ...(sort === "price_asc" && { price: "asc" }),
                    ...(sort === "price_desc" && { price: "desc" }),
                    ...(sort === "discount_desc" && { discount: "desc" }),
                    ...(sort === "discount_asc" && { discount: "asc" }),
                },
                take: pageSize + 1,
                cursor: cursor ? { id: cursor } : undefined,
            });

            const nextCursor = products.length > pageSize ? products[pageSize].id : null;

            const data = {
                products,
                nextCursor,
            };

            return c.json(data);
        }
    )
    .get("/home/trending", async (c) => {
        const products = await db.product.findMany({
            where: {
                status: PRODUCT_STATUS.Active
            },
            include: {
                category: true,
                variants: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 10,
        });

        return c.json({
            products,
        });
    })
    .get(
        "/home/forYou",
        async (c) => {
            const products = await db.product.findMany({
                where: {
                    // totalSold: {
                    //   gt: 0,
                    // },
                    status: PRODUCT_STATUS.Active
                },
                include: {
                    category: true,
                    variants: true,
                },
                orderBy: {
                    rating: "asc",
                },
                take: 10,
            });

            return c.json({
                products,
            });
        })
    .get(
        "/home/discount",
        async (c) => {
            const products = await db.product.findMany({
                where: {
                    status: PRODUCT_STATUS.Active,
                    // variants: {
                    //   some: {
                    //     discount: {
                    //       gt: 0,
                    //     },
                    //   },
                    // },
                },
                include: {
                    category: true,
                    variants: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 10,
            });

            return c.json({
                products,
            });
        }
    )
    .get(
        "/stat",
        isAdmin,
        async (c) => {
            const [totalProduct, activeProduct, inactiveProduct, outOfStockProduct] = await Promise.all([
                db.product.count(),
                db.product.count({
                    where: {
                        status: PRODUCT_STATUS.Active
                    }
                }),
                db.product.count({
                    where: {
                        status: PRODUCT_STATUS.Inactive
                    }
                }),
                db.product.count({ where: { totalStock: 0 } }),
            ]);
            return c.json({ totalProduct, activeProduct, inactiveProduct, outOfStockProduct });
        }
    )
    .get(
        "/home/recent",
        async (c) => {
            const products = await db.product.findMany({
                where: {
                    status: PRODUCT_STATUS.Active,
                },
                include: {
                    category: true,
                    variants: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 10,
            });
            return c.json({
                products,
            });
        }
    )
    .get(
        "/home/bestSelling",
        async (c) => {
            const products = await db.product.findMany({
                where: {
                    status: PRODUCT_STATUS.Active,
                },
                include: {
                    category: true,
                    variants: true,
                },
                orderBy: {
                    totalSold: "desc",
                },
                take: 10,
            });

            return c.json({
                products,
            });
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
                category: z.string().optional(),
                brand: z.string().optional(),
                status: z.string().optional(),
            })
        ),
        async (c) => {
            const { query, page, limit, sort, category, brand, status } =
                c.req.valid("query");

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
                                },
                            },
                        }),
                        ...(brand && {
                            brand: {
                                name: {
                                    contains: brand,
                                    mode: "insensitive",
                                },
                            },
                        }),
                        ...(status && { status: { equals: status } }),
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
                                },
                            },
                        }),
                        ...(brand && {
                            brand: {
                                name: {
                                    contains: brand,
                                    mode: "insensitive",
                                },
                            },
                        }),
                        ...(status && { status }),
                    },
                }),
            ]);

            return c.json({ products, totalCount });
        }
    )

export default app;
