import { openai } from "@/lib/openai";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const llmRouter = router({
    sendMessage: publicProcedure.input(z.array(
        z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string().min(1, "Message cannot be empty"),
        })
    )).mutation(async ({ input }) => {
        // Simulate a call to an LLM API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: input
        });

        return {
            response: completion.choices[0]?.message?.content || "",
        };
    }),
})

