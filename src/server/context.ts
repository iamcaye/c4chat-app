import { getAuth } from "@clerk/nextjs/server";
import * as trpcNext from '@trpc/server/adapters/next';
import { db } from "@/db/drizzle";

export async function createContext({
    req,
}: trpcNext.CreateNextContextOptions) {
    // Create your context based on the request object
    // Will be available as `ctx` in all your resolvers
    // This is just an example of something you might want to do in your ctx fn
    async function getUserFromHeader() {
        const auth = getAuth(req);
        return auth.userId ? { id: auth.userId, auth } : null;
    }

    const user = await getUserFromHeader();
    return {
        req,
        user,
        db,
    };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
