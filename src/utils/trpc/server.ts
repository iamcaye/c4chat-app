import { appRouter } from "@/server";
import { db } from "@/db/drizzle";
import { auth } from '@clerk/nextjs/server'; // <-- server-safe

export async function createServerContext() {
    const session = await auth(); // runs server-side in Server Component

    return {
        userId: session.userId || "",
        db,
    };
}

export async function getTrpcServer() {
    const context = await createServerContext();
    return appRouter.createCaller(context);
}

