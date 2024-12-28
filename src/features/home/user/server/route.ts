import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { sessionMiddleware } from "@/lib/session-middleware";
import { UserSchema } from "../schema";
import { db } from "@/lib/db";
import { ORDER_STATUS } from "@/constant";

const app = new Hono().put(
  "/:id",
  sessionMiddleware,
  zValidator(
    "param",
    z.object({
      id: z.string(),
    })
  ),
  zValidator("json", UserSchema),
  async (c) => {
    const user = c.get("user");
    const body = c.req.valid("json");

    try {
      const dbUser = await db.user.findUnique({
        where: {
          id: user.userId,
        },
      });

      if (!dbUser) {
        return c.json({ error: "User not found" }, 404);
      }

      await db.user.update({
        where: { id: dbUser.id },
        data: { ...body },
      });

      return c.json({ success: "Profile updated" });
    } catch {
      return c.json({ error: "Internal server error" }, 500);
    }
  }
)
  .put(
    "/password/:id",
    sessionMiddleware,
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    zValidator("json", z.object({
      oldPassword: z.string(),
      password: z.string(),
    })),
    async (c) => {
      const id = c.req.param("id");
      const body = c.req.valid("json");
      try {
        const user = await db.user.findUnique({
          where: {
            id: id,
          },
        });

        if (!user) {
          return c.json({ error: "User not found" }, 404);
        }

        const isPasswordCorrect = await bcrypt.compare(body.oldPassword, user.password ?? "");

        if (!isPasswordCorrect) {
          return c.json({ error: "Old password is incorrect" }, 400);
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        await db.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });

        return c.json({ success: "Password updated" });
      } catch {
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .get(
    "/orders/:id",
    sessionMiddleware,
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    zValidator("query", z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      sort: z.string().optional(),
      status: z.string().optional(),
    })),
    async (c) => {
      const id = c.req.param("id");
      const { page, limit, sort, status } = c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const [orders, totalCount] = await Promise.all([
        db.order.findMany({
          where: {
            ...(status && { status }),
            userId: id,
          },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
          orderBy: {
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.order.count({
          where: {
            ...(status && { status }),
            userId: id,
          },
        }),
      ]);

      return c.json({ orders, totalCount });
    }
  )
  .get(
    "/reviews",
    sessionMiddleware,
    zValidator("query", z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      sort: z.string().optional(),
    })),
    async (c) => {
      const { userId } = c.get("user");
      const { page, limit, sort } = c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const [reviews, totalCount] = await Promise.all([
        db.review.findMany({
          where: {
            userId,
          },
          include: {
            product: true,
          },
          orderBy: {
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.review.count({
          where: {
            userId,
          },
        }),
      ]);

      return c.json({ reviews, totalCount });
    }
  )
  .get(
    "/notReviewed",
    sessionMiddleware,
    zValidator("query", z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      sort: z.string().optional(),
    })),
    async (c) => {
      const { userId } = c.get("user");
      const { page, limit, sort } = c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const [products, totalCount] = await Promise.all([
        db.product.findMany({
          where: {
            orderItems: {
              some: {
                order: {
                  userId,
                  status: ORDER_STATUS.Delivered,
                },
                product: {
                  reviews: {
                    none: {
                      userId,
                    },
                  },
                },
              },
            }
          },
          include: {
            orderItems: {
              include: {
                order: true,
              },
            },
          },
          orderBy: {
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.product.count({
          where: {
            orderItems: {
              some: {
                order: {
                  userId,
                  status: ORDER_STATUS.Delivered,
                },
                product: {
                  reviews: {
                    none: {
                      userId,
                    },
                  },
                },
              },
            }
          },
        }),
      ]);

      return c.json({ products, totalCount });
    }
  )
  .get(
    "/questions",
    sessionMiddleware,
    zValidator("query", z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      sort: z.string().optional(),
    })),
    async (c) => {
      const { userId } = c.get("user");
      const { page, limit, sort } = c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const [questions, totalCount] = await Promise.all([
        db.question.findMany({
          where: {
            userId,
          },
          include: {
            product: true,
            answers: {
              select: {
                id: true,
                answer: true,
                createdAt: true,
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
            userId,
          },
        }),
      ]);

      return c.json({ questions, totalCount });
    }
  )
export default app;

