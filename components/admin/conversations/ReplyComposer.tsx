"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type ReplyComposerProps = {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
  sending?: boolean;
};

export default function ReplyComposer({ onSend, disabled, sending }: ReplyComposerProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || sending) return;

    setError(null);
    try {
      await onSend(trimmed);
      setValue("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reply");
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={disabled}
          placeholder={
            disabled ? "This conversation is closed." : "Type your reply to the customer..."
          }
          className="min-h-[90px] w-full resize-none px-5 py-4 text-sm text-gray-900 outline-none disabled:bg-gray-50 disabled:text-gray-400"
        />

        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-2">
          <span className="text-xs text-red-600">{error}</span>

          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || sending || !value.trim()}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#165DFC] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0f4bd6] disabled:cursor-not-allowed disabled:bg-[#a8b7ff]"
          >
            <Send size={14} />
            {sending ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </div>
    </div>
  );
}
