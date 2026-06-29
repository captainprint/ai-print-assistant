"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Props = {
  onSendMessage: (message: string) => void;
  isAiTyping: boolean;
};

export default function ChatInput({ onSendMessage, isAiTyping }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    const trimmedInput = input.trim();

    if (!trimmedInput) return;

    onSendMessage(trimmedInput);
    setInput("");
  };

  const isDisabled = !input.trim() || isAiTyping;

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto px-8 py-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            disabled={isAiTyping}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="Not sure what to print? Ask me anything....."
            className="flex-1 h-14 rounded-xl border-2 border-[#3157F6] px-4 text-[16px] text-gray-900 placeholder:text-[12px] placeholder:text-gray-500 outline-none"
          />

          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            className={`w-14 h-14 rounded-xl text-white flex items-center justify-center transition shrink-0 ${isDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#3157F6] hover:bg-[#2347d8] cursor-pointer"
              }`}
          >
            <Send size={24} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </footer>
  );
}