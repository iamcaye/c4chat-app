import { getTrpcServer } from "@/utils/trpc/server";
import { Chat } from "./chat";

export default async function ChatPage({
    params
}: {
    params: Promise<{ threadId?: string }>
}) {

    const threadId = (await params)?.threadId as string;
    const trpc = await getTrpcServer();

    const data = await trpc.llm.getThreadMessages({ threadId: threadId as string })

    return (
        <Chat
            inputMessages={data?.messages}
            thread={data?.thread} />
    );
}
