import { db } from "@/lib/db";
import { Hono } from "hono";

const app = new Hono()
  .get("/categories", async (c) => {
    const categories = await db.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });
    return c.json({
      categories,
    });
  })
  .get("/topCategories", async (c) => {
    const categories = await db.category.findMany({
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
  .get("/brands", async (c) => {
    const brands = await db.brand.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });
    return c.json({
      brands,
    });
  })
  .get("/banners", async (c) => {
    const banners = await db.banner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return c.json({
      banners,
    });
  })
  .get("/trending", async (c) => {
    const products = await db.product.findMany({
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
  });

export default app;
