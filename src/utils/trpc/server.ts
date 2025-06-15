import { appRouter } from "@/server";
import { NextRequest } from "next/server";
import { db } from "@/db/drizzle";

export const trpcServer = appRouter.createCaller({
    req: new NextRequest("http://localhost:3000/api/trpc"),
    user: null,
    db,
});
