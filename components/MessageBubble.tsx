import { UserRound } from "lucide-react";

type Props = {
  role: "ai" | "user";
  message: string;
  time: string;
  isTyping?: boolean;
};

export default function MessageBubble({
  role,
  message,
  time,
  isTyping,
}: Props) {
  if (role === "ai") {
    return (
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-[#3157F6] text-white flex items-center justify-center text-sm font-semibold shrink-0">
          AI
        </div>

        <div className="max-w-[320px] rounded-xl bg-white border border-gray-200 px-5 py-4 shadow-sm">
          {isTyping ? (
            <div className="flex items-center gap-1 py-1">
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.15s]" />
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.3s]" />
            </div>
          ) : (
            <p className="text-[16px] leading-relaxed text-gray-900">
              {message}
            </p>
          )}

          {!isTyping && (
            <p className="text-xs text-gray-500 mt-3">
              {time}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end items-start gap-3">
      <div className="max-w-[320px] rounded-xl bg-[#344054] px-5 py-4 shadow-sm break-words">
        <p className="text-white">{message}</p>

        <p className="text-xs text-gray-200 mt-3">
          {time}
        </p>
      </div>

      <div className="w-9 h-9 shrink-0 rounded-full bg-[#344054] text-white flex items-center justify-center">
        <UserRound size={18} />
      </div>
    </div>
  );
}