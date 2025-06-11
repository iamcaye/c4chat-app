"use client"
import { SendIcon } from "lucide-react";
import { FieldValues, useForm } from "react-hook-form"

export function PromptInput() {
  const {
    register,
    handleSubmit,
  } = useForm();

  const onSubmit = (data: FieldValues) => {
    const { message } = data;
    if (!message || message.trim() === "") {
      return;
    }
  }

  return (
    <form className="flex flex-col w-full p-4 max-h-[150px] overflow-y-auto relative" onSubmit={handleSubmit(onSubmit)}>
      <textarea id="prompt-input" className="border border-gray-500 rounded-lg p-4 w-full h-64 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent bg-secondary placeholder:text-gray-400"
        {...register("message")}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }
        }}
        placeholder="Type your message here...">
      </textarea>
      <button type="submit" className="absolute right-8 bottom-8 bg-primary rounded-full p-2  hover:bg-primary/90 transition-colors duration-200 hover:ring-2 hover:ring-primary/50 active:ring-2 active:ring-primary/80">
        <SendIcon />
      </button>
    </form>
  )
}
