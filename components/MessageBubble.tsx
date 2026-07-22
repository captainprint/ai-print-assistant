import { UserRound } from "lucide-react";
import RecommendationCards from "./RecommendationCards";
import type { ChatRecommendation, MatchedImageGroup } from "@/lib/chat";

type Props = {
  role: "ai" | "user";
  message: string;
  time: string;
  isTyping?: boolean;
  recommendations?: ChatRecommendation[];
  images?: MatchedImageGroup[];
  senderName?: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MessageBubble({
  role,
  message,
  time,
  isTyping,
  recommendations,
  images,
  senderName,
}: Props) {
  if (role === "ai") {
    return (
      <div className="flex min-w-0 max-w-full items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-[#3157F6] text-white flex items-center justify-center text-sm font-semibold shrink-0">
          {senderName ? initials(senderName) : "AI"}
        </div>

        <div className="min-w-0 max-w-[calc(100%-48px)] rounded-xl bg-white border border-gray-200 px-5 py-4 shadow-sm sm:max-w-[420px]">
          {senderName && !isTyping && (
            <p className="text-xs font-semibold text-gray-500 mb-1">{senderName}</p>
          )}

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

          {!isTyping && recommendations && recommendations.length > 0 && (
            <RecommendationCards recommendations={recommendations} images={images ?? []} />
          )}

          {!isTyping && (
            <p className="text-xs text-gray-500 mt-3" suppressHydrationWarning>
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

        <p className="text-xs text-gray-200 mt-3" suppressHydrationWarning>
          {time}
        </p>
      </div>

      <div className="w-9 h-9 shrink-0 rounded-full bg-[#344054] text-white flex items-center justify-center">
        <UserRound size={18} />
      </div>
    </div>
  );
}