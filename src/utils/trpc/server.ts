import { appRouter } from "@/server";
import { NextRequest } from "next/server";
import { db } from "@/db/drizzle";

export const trpcServer = appRouter.createCaller({
    req: new NextRequest("/api/trpc"),
    user: null,
    db,
});
