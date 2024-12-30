import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { db } from "@/lib/db";
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";
import { ProductSchema } from "../schema";
import { QuestionSchema, ReviewSchema } from "@/features/home/products/schemas";
import { ORDER_STATUS, PRODUCT_STATUS } from "@/constant";

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
        orderBy: { createdAt: "desc" },
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
  )
  .get(
    "/review/admin",
    isAdmin,
    zValidator("query", z.object({
      query: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
      sort: z.string().optional(),
    })),
    async (c) => {
      const { query, page, limit, sort } = c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const [reviews, totalCount] = await Promise.all([
        db.review.findMany({
          where: {
            ...(query && {
              product: {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            })
          },
          include: {
            product: true,
            user: true,
          },
          orderBy: {
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.review.count({
          where: {
            ...(query && {
              product: {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            }),
          },
        }),
      ]);

      return c.json({ reviews, totalCount });
    }
  )
  .delete(
    "/review/:id",
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const id = await c.req.param("id");

      try {
        const review = await db.review.findUnique({ where: { id }, include: { product: true } });

        if (!review) {
          return c.json({ error: "Review not found" }, 404);
        }

        await db.review.delete({ where: { id } });

        const product = await db.product.findUnique({
          where: { id: review.productId },
          include: {
            reviews: true,
          },
        });

        if (!product) {
          return c.json({ error: "Product not found" }, 404);
        }

        const remainingReviews = product.reviews;
        const newTotalReview = remainingReviews.length;

        let newRating = 0;
        if (newTotalReview > 0) {
          const totalRating = remainingReviews.reduce(
            (sum, r) => sum + r.rating,
            0
          );
          newRating = Math.floor((totalRating / newTotalReview) * 2) / 2;
        }

        await db.product.update({
          where: { id: review.productId },
          data: { totalReview: newTotalReview, rating: newRating },
        });

        return c.json({ success: "Review deleted" }, 200);
      } catch {
        return c.json({ error: "Failed to delete review" }, 500);
      }
    }
  )
  .post(
    "/question/:id",
    sessionMiddleware,
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", QuestionSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const { question, productId } = c.req.valid("json");
      const { userId } = c.get("user");
      try {
        const product = await db.product.findUnique({
          where: { id },
        });

        if (!product) {
          return c.json({ error: "Product not found" }, 404);
        }

        await db.question.create({
          data: { question, productId, userId },
        });

        return c.json({ success: "Question added" });
      } catch (error) {
        console.log(error);
        return c.json({ error: "Failed to add question" }, 500);
      }
    }
  )
  .get(
    "/questions/:id",
    zValidator("param", z.object({ id: z.string() })),
    zValidator("query", z.object({ cursor: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const { cursor } = c.req.valid("query") || undefined;

      const pageSize = 3;

      const questions = await db.question.findMany({
        where: { productId: id },
        include: {
          user: true,
          answers: {
            include: {
              user: true,
            }
          }
        },
        orderBy: { createdAt: "desc" },
        take: -pageSize - 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      const previousCursor = questions.length > pageSize ? questions[0].id : null;

      const data = {
        questions: questions.length > pageSize ? questions.slice(1) : questions,
        previousCursor,
      };

      return c.json(data);
    }
  )
  .get(
    "/question/admin",
    isAdmin,
    zValidator("query", z.object({
      query: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
      sort: z.string().optional(),
    })),
    async (c) => {
      const { query, page, limit, sort } = c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const [questions, totalCount] = await Promise.all([
        db.question.findMany({
          where: {
            ...(query && {
              product: {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            })
          },
          include: {
            product: true,
            user: true,
            answers: {
              select: {
                id: true,
              }
            }
          },
          orderBy: {
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.question.count({
          where: {
            ...(query && {
              product: {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            }),
          },
        }),
      ]);

      return c.json({ questions, totalCount });
    }
  )
  .delete(
    "/question/:id",
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const id = await c.req.param("id");

      try {
        const question = await db.question.findUnique({ where: { id }, include: { product: true } });

        if (!question) {
          return c.json({ error: "Question not found" }, 404);
        }

        await db.question.delete({ where: { id } });

        return c.json({ success: "Question deleted" }, 200);
      } catch {
        return c.json({ error: "Failed to delete question" }, 500);
      }
    }
  )
  .post(
    "/answer/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", z.object({
      answer: z.string(),
    })),
    async (c) => {
      const { id } = c.req.valid("param");
      const { answer } = c.req.valid("json");
      const { userId } = c.get("user")
      try {
        const question = await db.question.findUnique({ where: { id } });

        if (!question) {
          return c.json({ error: "Question not found" }, 404);
        }

        await db.answer.create({
          data: {
            answer,
            questionId: id,
            userId,
          }
        });

        return c.json({ success: "Answer added" });
      } catch (error) {
        console.log(error);
        return c.json({ error: "Failed to add answer" }, 500);
      }
    }
  )
  .get(
    "/reviews/top/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const id = await c.req.valid("param").id;
      const reviews = await db.review.findMany({
        where: {
          productId: id,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            }
          },
        },
        orderBy: [
          { rating: "asc" },
          { createdAt: "desc" },
        ],
        take: 5,
      });
      return c.json(reviews);
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
    })),
    async (c) => {
      const { cursor, query, sort, inStock, priceMin, priceMax, discountMin, discountMax, discount, rating, category, brand } = c.req.valid("query");

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
export default app;
