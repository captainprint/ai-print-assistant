"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Link from "next/link";

type Props = {
  onSendMessage: (message: string) => void;
  isAiTyping: boolean;
  disabled?: boolean;
  disabledReason?: string;
};

export default function ChatInput({ onSendMessage, isAiTyping, disabled, disabledReason }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    const trimmedInput = input.trim();

    if (!trimmedInput) return;

    onSendMessage(trimmedInput);
    setInput("");
  };

  const isInputDisabled = isAiTyping || !!disabled;
  const isDisabled = !input.trim() || isInputDisabled;

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto px-8 py-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            disabled={isInputDisabled}
            maxLength={500}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder={
              disabled
                ? disabledReason || "This conversation has been handed off to our team."
                : "Not sure what to print? Ask me anything..."
            }
            className="flex-1 h-14 rounded-xl border-2 border-[#3157F6] px-4 text-[16px] text-gray-900 placeholder:text-[12px] placeholder:text-gray-500 outline-none disabled:bg-gray-50 disabled:text-gray-400"
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

        <p className="mt-2 text-center text-[11px] leading-4 tet-gray-400">
          AI can make mistakes. Please double-check important product details before ordering.{" "}
  If you have any questions, feel free to{" "}
  <Link
    href="https://captainprint.com/contact-us/"
    className="text-[#3157F6] hover:underline"
  >
    contact us
  </Link>
  .
        </p>
      </div>
    </footer>
  );
}