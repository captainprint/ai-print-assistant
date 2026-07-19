import type { ChatRecommendation, MatchedImageGroup } from "@/lib/chat";

export type Message = {
  role: "ai" | "user";
  message: string;
  time: string;
  suggestions?: string[];
  isTyping?: boolean;
  recommendations?: ChatRecommendation[];
  images?: MatchedImageGroup[];
  /** Staff member's name, when this "ai"-slot message is actually a human reply. */
  senderName?: string;
};