export type Message = {
  role: "ai" | "user";
  message: string;
  time: string;
  suggestions?: string[];
  isTyping?: boolean;
};