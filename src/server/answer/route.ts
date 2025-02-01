import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { db } from "@/lib/db";
import { sessionMiddleware } from "@/lib/session-middleware";
import { isAdmin } from "@/lib/session-middleware";

const app = new Hono()
    .post(
        "/:questionId",
        sessionMiddleware,
        isAdmin,
        zValidator("param", z.object({ questionId: z.string() })),
        zValidator("json", z.object({
            answer: z.string(),
        })),
        async (c) => {
            const { questionId } = c.req.valid("param");
            const { answer } = c.req.valid("json");
            const { userId } = c.get("user")
            try {
                const question = await db.question.findUnique({ where: { id: questionId } });

                if (!question) {
                    return c.json({ error: "Question not found" }, 404);
                }

                await db.answer.create({
                    data: {
                        answer,
                        questionId: questionId,
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

export default app;