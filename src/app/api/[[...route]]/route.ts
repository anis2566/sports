import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";

// export const runtime = "edge";

import authApp from "@/features/auth/server/route";
import brandApp from "@/features/dashboard/brand/server/route";
import categoryApp from "@/features/dashboard/category/server/route";
import productApp from "@/features/dashboard/product/server/route";
import homeApp from "@/features/home/server/route";
import bannerApp from "@/features/dashboard/banner/server/route";
import checkoutApp from "@/features/home/checkout/server/route";
import orderApp from "@/features/dashboard/order/server/route";

const app = new Hono()
  .basePath("/api")
  .use(cors())
  .route("/auth", authApp)
  .route("/brand", brandApp)
  .route("/category", categoryApp)
  .route("/product", productApp)
  .route("/home", homeApp)
  .route("/banner", bannerApp)
  .route("/checkout", checkoutApp)
  .route("/order", orderApp)

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);

export type AppType = typeof app;