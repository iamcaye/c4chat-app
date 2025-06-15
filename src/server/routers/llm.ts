import { openai } from "@/lib/openai";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { messages, threads } from "@/db/schema";

const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
    if (!ctx.user || !ctx.user.id) {
        throw new Error("Unauthorized");
    }
    return next({
        ctx: {
            user: ctx.user,
        },
    });
});

export const llmRouter = router({
    sendMessage: protectedProcedure.input(z.object({
        threadId: z.string().optional(),
        messages: z.array(
            z.object({
                role: z.enum(["user", "assistant"]),
                content: z.string().min(1, "Message cannot be empty"),
            }))
    })).mutation(async ({ input, ctx }) => {
        const userId = ctx.user?.id;
        if (!userId) {
            throw new Error("User not authenticated");
        }

        const { db } = ctx;

        try {
            if (!input.threadId) {
                const threadTitleRes = await openai.responses.create({
                    model: "gpt-3.5-turbo",
                    instructions: "Generate a title for this conversation",
                    input: input.messages[0].content,
                });
                const threadTitle = threadTitleRes.output_text || "New Thread";

                const thread = await db.insert(threads).values({
                    title: threadTitle,
                    userId: userId,
                }).returning({ id: threads.id });

                if (thread.length === 0 || !thread[0].id) {
                    throw new Error("Failed to create thread");
                }
                input.threadId = thread[0].id;
            }

        } catch (error) {
            console.log("Error creating thread:", error)
            throw new Error("Failed to create thread");
        }
        await db.insert(messages).values({
            threadId: input.threadId,
            content: input.messages.at(-1)?.content || "",
            contentType: "text",
            role: "user",
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: input.messages
        });

        await db.insert(messages).values({
            threadId: input.threadId,
            content: completion.choices[0]?.message?.content || "",
            contentType: "text",
            role: "assistant",
        })

        return {
            response: completion.choices[0]?.message?.content || "",
        };
    }),
})

