"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import type { Message } from "../types/message";

const suggestions = [
  "Show me premium options",
  "What paper do you recommend?",
  "Talk to a print specialist",
];

type Props = {
  messages: Message[];
  onSuggestionClick: (question: string) => void;
};

export default function ChatArea({
  messages,
  onSuggestionClick,
}: Props) {

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      bottomRef.current?.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "ai-widget-opened") {
        setTimeout(scrollToBottom, 100);
      }
    };

    scrollToBottom();

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [messages]);

  const lastMessage = messages[messages.length - 1];
  const shouldShowSuggestions = lastMessage?.role === "ai";

  return (
    <section className="flex-1 overflow-y-auto">
      <div className="max-w-[900px] mx-auto px-8 py-8 pb-6 space-y-6">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            role={message.role}
            message={message.message}
            time={message.time}
          />
        ))}

        {shouldShowSuggestions && (
          <div className="ml-12 flex flex-wrap gap-3">
            {suggestions.map((question) => (
              <button
                key={question}
                onClick={() => onSuggestionClick(question)}
                className="rounded-full bg-white border border-gray-200 px-4 py-2 text-sm text-gray-700 shadow-sm hover:border-[#3157F6] hover:text-[#3157F6] transition cursor-pointer"
              >
                {question}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </section>
  );
}