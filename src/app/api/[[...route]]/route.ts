import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { createRouteHandler } from 'uploadthing/server';

// export const runtime = "edge";

import authApp from "@/features/auth/server/route";
import brandApp from "@/server/brand/route";
import categoryApp from "@/server/category/route";
import productApp from "@/server/product/route";
import homeApp from "@/features/home/server/route";
import bannerApp from "@/server/banner/route";
import checkoutApp from "@/features/home/checkout/server/route";
import orderApp from "@/server/order/route";
import questionApp from "@/server/question/route";
import reviewApp from "@/server/review/route";
import userApp from "@/server/user/route";
import dashboardApp from "@/server/dashboard/route";
import subscriberApp from "@/server/subscriber/route";
import sellerApp from "@/server/seller/route";
import { uploadRouter } from "@/lib/uploadthing";

const handlers = createRouteHandler({
  router: uploadRouter,
});


const app = new Hono()
  .basePath("/api")
  .use(cors())
  .all("/uploadthing", (c) => handlers(c.req.raw))
  .route("/auth", authApp)
  .route("/brand", brandApp)
  .route("/category", categoryApp)
  .route("/product", productApp)
  .route("/home", homeApp)
  .route("/banner", bannerApp)
  .route("/checkout", checkoutApp)
  .route("/order", orderApp)
  .route("/question", questionApp)
  .route("/review", reviewApp)
  .route("/user", userApp)
  .route("/dashboard", dashboardApp)
  .route("/subscriber", subscriberApp)
  .route("/seller", sellerApp);

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);

export type AppType = typeof app;