import { inferRouterOutputs } from '@trpc/server';
import { publicProcedure, router } from './trpc';
import { llmRouter } from './routers/llm';

export const appRouter = router({
    greeting: publicProcedure.query(() => 'hello tRPC v10!'),
    llm: llmRouter
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>
