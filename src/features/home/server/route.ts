import { CATEGORY_STATUS, PRODUCT_STATUS } from "@/constant";
import { db } from "@/lib/db";
import { Hono } from "hono";

const app = new Hono()
  .get("/categories", async (c) => {
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
  .get("/topCategories", async (c) => {
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
    "/forYou",
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
    "/discount",
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
    "/featuredCategories",
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
    "/recentlyAdded",
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
    "/bestSelling",
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

export default app;
