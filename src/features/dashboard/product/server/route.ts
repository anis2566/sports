import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { db } from "@/lib/db";
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";
import { ProductSchema } from "../schema";
import { ReviewSchema } from "@/features/home/products/schemas";
import { ORDER_STATUS } from "@/constant";

const app = new Hono()
  .get(
    "/categoryForSelect",
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
    "/brandForSelect",
    zValidator(
      "query",
      z.object({
        query: z.string().optional(),
      })
    ),
    async (c) => {
      const { query } = c.req.valid("query");
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
      });
      return c.json(brands);
    }
  )
  .post("/", isAdmin, zValidator("json", ProductSchema), async (c) => {
    const body = c.req.valid("json");
    try {
      const totalStock = body.variants.reduce(
        (acc, variant) => acc + variant.stock,
        0
      );

      const variantsData = body.variants.map((variant) => ({
        name: variant.name,
        stock: variant.stock,
        colors: variant.colors,
        price: variant.price,
        discount:
          variant.discountPrice && variant.discountPrice > 0
            ? (variant.price - variant.discountPrice) / variant.price
            : 0,
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
  })
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

      console.log(products);

      return c.json({ products, totalCount });
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
  .post(
    "/review/:id",
    sessionMiddleware,
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", ReviewSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const { rating, content } = c.req.valid("json");
      const { userId } = c.get("user");
      try {
        const isBougth = await db.order.findFirst({
          where: {
            userId: userId,
            orderItems: {
              some: {
                productId: id,
              },
            },
            status: ORDER_STATUS.Delivered,
          },
        });

        if (!isBougth) {
          return c.json({ error: "You must buy this product to review" }, 400);
        }

        const isReviewed = await db.review.findFirst({
          where: {
            userId: userId,
            productId: id,
          },
        });

        if (isReviewed) {
          return c.json(
            { error: "You have already reviewed this product" },
            400
          );
        }

        await db.review.create({
          data: { rating, content, productId: id, userId },
        });

        const product = await db.product.findUnique({
          where: { id },
        });

        if (!product) {
          return c.json({ error: "Product not found" }, 404);
        }

        const currentTotalReview = product.totalReview;
        const currentRating = product.rating || 0;

        const newTotalReview = currentTotalReview + 1;
        const newRating =
          Math.floor(
            ((currentRating * currentTotalReview + rating) / newTotalReview) * 2
          ) / 2;

        await db.product.update({
          where: { id },
          data: { totalReview: { increment: 1 }, rating: newRating },
        });

        return c.json({ success: "Review added" });
      } catch (error) {
        console.log(error);
        return c.json({ error: "Failed to add review" }, 500);
      }
    }
  )
  .get(
    "/reviews/:id",
    zValidator("param", z.object({ id: z.string() })),
    zValidator("query", z.object({ cursor: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const { cursor } = c.req.valid("query") || undefined;

      const pageSize = 3;

      const reviews = await db.review.findMany({
        where: { productId: id },
        include: {
          user: true,
        },
        orderBy: { createdAt: "asc" },
        take: -pageSize - 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      const previousCursor = reviews.length > pageSize ? reviews[0].id : null;

      const data = {
        reviews: reviews.length > pageSize ? reviews.slice(1) : reviews,
        previousCursor,
      };

      return c.json(data);
    }
  );

export default app;
