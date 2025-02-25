import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import { sign, verify } from "hono/jwt";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import { db } from "@/lib/db";
import { SignInSchema, SignUpSchema } from "../schemas";
import { JWTPayload, sessionMiddleware } from "@/lib/session-middleware";
import { AUTH_COOKIE } from "@/constant";

const app = new Hono()
  .post("/register", zValidator("json", SignUpSchema), async (c) => {
    const { email, password, name } = c.req.valid("json");

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return c.json(
        {
          error: "User already exists",
        },
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return c.json(
      {
        success: "Registration successful",
      },
      200
    );
  })
  .post("/login", zValidator("json", SignInSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return c.json({ error: "Invalid credentials" }, 400);
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password || ""
    );

    if (!isPasswordCorrect) {
      return c.json({ error: "Invalid password" }, 400);
    }

    const payload = {
      name: user.name,
      email: user.email,
      image: user.image,
      userId: user.id,
      role: user.role,
      status: user.status,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    };

    const secret = process.env.JWT_SECRET!;
    const token = await sign(payload, secret);

    setCookie(c, AUTH_COOKIE, token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
    });

    return c.json({ success: "Login successful", token });
  })
  .get("/current", async (c) => {
    const session = getCookie(c, AUTH_COOKIE);

    if (!session) {
      return c.json({ user: null }, 400);
    }

    const decodedPayload = await verify(session, process.env.JWT_SECRET!);

    if (!decodedPayload) {
      return c.json({ user: null }, 401);
    }

    const { name, email, image, userId, role, status } = decodedPayload;

    const user = { name, email, image, userId, role, status } as JWTPayload;

    return c.json({ user });
  })
  .post("/logout", sessionMiddleware, async (c) => {
    deleteCookie(c, AUTH_COOKIE);
    return c.json({ success: "Logout successful" });
  });

export default app;
