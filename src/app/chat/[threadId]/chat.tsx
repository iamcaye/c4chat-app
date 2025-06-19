"use client";

import { PromptInput } from "@/components/prompt-input";
import { AppRouter } from "@/server";
import { trpc } from "@/utils/trpc/client";
import { inferProcedureOutput } from "@trpc/server";
import { useEffect, useState } from "react";

export function Chat({
    inputMessages,
    thread,
}: {
    inputMessages?: inferProcedureOutput<AppRouter["llm"]["getThreadMessages"]>["messages"]
    thread?: inferProcedureOutput<AppRouter["llm"]["getThreadMessages"]>["thread"];
}) {
    const [loading, setLoading] = useState(false);
    const utils = trpc.useUtils();
    const [messages, setMessages] = useState(inputMessages || []);

    useEffect(() => {
        const chatContainer = document.getElementById("chat-container");
        if (chatContainer) {
            // smooth scroll
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    let threadId = thread?.id || '';

    const mutation = trpc.llm.sendMessage.useMutation({
        onSuccess: (res) => {
            setLoading(false);
            console.log("Message sent successfully:", res);
            // Optionally clear the input after sending
            if (!threadId) {
                threadId = res.threadId;
                utils.llm.getThreads.invalidate();
            }

            setMessages([...messages, {
                id: crypto.randomUUID(),
                role: 'assistant' as const,
                content: res.response,
                threadId: threadId,
                contentType: 'text' as const,
                createdAt: new Date().toISOString(),
            }]);
        },
        onError: (error) => {
            console.error("Error sending message:", error);
            setLoading(false);
        },
    })

    const onSend = (message: string) => {
        const newMessage = {
            id: crypto.randomUUID(),
            role: 'user' as const,
            content: message,
            threadId: threadId,
            contentType: 'text' as const,
            createdAt: new Date().toISOString(),
        }
        setMessages([...messages, newMessage]);
        setLoading(true);
        const prompt = document.getElementById("prompt-input") as HTMLTextAreaElement;
        if (prompt) {
            prompt.value = "";
        }


        mutation.mutate({
            messages: [...messages, newMessage]?.map((msg) => ({ role: msg.role, content: msg.content })) || [],
            threadId,
        }, {
            onSuccess: (res) => {
                threadId = res.threadId;
                utils.llm.getThreadMessages.invalidate({ threadId });
            }
        });
    }

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            <div className="p-4">
                <h1 className="text-2xl font-bold pb-2 mb-4 text-primary/80">
                    {thread?.title}
                </h1>
            </div >
            <div className="flex-1 overflow-y-auto p-4" id="chat-container">
                <div className="w-full md:w-9/10 lg:w-8/10 mx-auto flex flex-col">
                    {
                        messages?.map((message) => (
                            <div key={message.id} className={`flex mb-4 p-2 break-words whitespace-pre-line
                            ${message.role === 'user'
                                    ? 'bg-primary/20 self-end w-fit rounded-md'
                                    : 'w-full border-b border-gray-200'}`}>
                                {message.content}
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="w-full md:w-10/10 lg:w-8/10 mx-auto">
                <PromptInput
                    loading={loading}
                    onSendAction={onSend}
                />
            </div>
        </div >
    );
}
