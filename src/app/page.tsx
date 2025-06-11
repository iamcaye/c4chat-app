"use client"
import { PromptInput } from "@/components/prompt-input";

export default function Home() {

  return (
    <div className="flex h-full flex-col w-full items-center justify-center">
      <div className="flex flex-col w-full items-start justify-start p-4 flex-1 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center w-full">What&apos;s on your mind?</h2>
      </div>
      <PromptInput />
    </div>
  );
}
