import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { NextRequest } from "next/server";

export async function createContext({ req }: { req: NextRequest }) {
    async function getUserFromHeader() {
        const auth = getAuth(req);
        return auth.userId ? { id: auth.userId, auth } : null;
    }

    const user = await getUserFromHeader();
    return {
        userId: user?.id || "",
        db,
    };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
