"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Props = {
  onSendMessage: (message: string) => void;
};

export default function ChatInput({ onSendMessage }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    const trimmedInput = input.trim();

    if (!trimmedInput) return;

    onSendMessage(trimmedInput);
    setInput("");
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto px-8 py-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="Not sure what to print? Ask me anything....."
            className="flex-1 h-14 rounded-xl border-2 border-[#3157F6] px-4 text-[12px] text-gray-900 placeholder:text-gray-500 outline-none"
          />

          <button
            onClick={handleSubmit}
            className="w-14 h-14 rounded-xl bg-[#3157F6] text-white flex items-center justify-center hover:bg-[#2347d8] transition cursor-pointer"
          >
            <Send size={24} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </footer>
  );
}