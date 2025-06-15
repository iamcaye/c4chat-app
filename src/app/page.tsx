"use client";

import { PromptInput } from "@/components/prompt-input";
import { trpc } from "@/utils/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const clerk = useClerk();

  const mutation = trpc.llm.sendMessage.useMutation({})


  const onSend = (message: string) => {
    console.log("Message sent:", message);
    mutation.mutate({
      threadId: undefined, // You can set this to a specific thread ID if needed
      messages: [{
        role: "user",
        content: message,
      }],
    }, {
      onSuccess: (res) => {
        router.push(`/chat/${res.threadId}`);
        utils.llm.getThreads.invalidate();
        utils.llm.getThreadMessages.invalidate({ threadId: res.threadId as string });
      },
      onError: (error) => {
        console.log(JSON.stringify(error, null, 2));
        if (error.shape?.message.toUpperCase() === "UNAUTHORIZED") {
          // show sigin modal
          localStorage.setItem("message", message);
          clerk.openSignIn({
            oauthFlow: "popup",
          });
        }
      },
    });
    // Here you can implement the logic to handle the sent message,
    // such as updating state or sending it to a server.
  }
  return (
    <div className="flex h-full flex-col w-full items-center justify-center">
      <div className="flex flex-col w-full items-start justify-start p-4 flex-1 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center w-full">What&apos;s on your mind?</h2>
      </div>
      <PromptInput onSendAction={onSend} />
    </div>
  );
}
