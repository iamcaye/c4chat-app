"use client"
import { Loader2Icon, SendIcon } from "lucide-react";
import { FieldValues, useForm } from "react-hook-form"

export function PromptInput({
  loading = false,
  onSendAction = (message: string) => { console.log("Message sent:", message); }
}: {
  loading?: boolean;
  onSendAction?: (message: string) => void;
}) {
  const {
    register,
    handleSubmit,
  } = useForm();

  let initMessage = "";
  if (typeof window !== "undefined") {
    initMessage = localStorage.getItem("message") || "";
    localStorage.removeItem("message");
  }

  const onSubmit = (data: FieldValues) => {
    const { message } = data;
    if (!message || message.trim() === "") {
      return;
    }
    onSendAction(message);
  }

  return (
    <form className="flex flex-col w-full p-4 max-h-[150px] overflow-y-auto relative" onSubmit={handleSubmit(onSubmit)}>
      <textarea id="prompt-input" className="border border-gray-500 rounded-lg p-4 w-full h-64 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent bg-secondary placeholder:text-gray-400 shadow-lg"
        {...register("message")}
        defaultValue={initMessage}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }
        }}
        placeholder="Type your message here...">
      </textarea>
      <button type="submit" className="absolute right-8 bottom-8 bg-primary rounded-full p-2  hover:bg-primary/90 transition-colors duration-200 hover:ring-2 hover:ring-primary/50 active:ring-2 active:ring-primary/80">
        {loading
          ? <Loader2Icon className="animate-spin h-6 w-6 text-white" />
          : <SendIcon />
        }
      </button>
    </form>
  )
}
