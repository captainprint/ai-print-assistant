import type { Message } from "./mockMessages";

export const mockMarcusMessages: Message[] = [
  {
    id: "1",
    sender: "customer",
    senderName: "Marcus Brennan",
    initials: "MB",
    message:
      "Hi! I'm looking for a quote for 500 double-sided flyers.",
    time: "2:14 PM",
  },
  {
    id: "2",
    sender: "ai",
    senderName: "AI Assistant",
    initials: "AI",
    message:
      "Sure! What size would you like? We offer 5.5×8.5, 8.5×11 and custom sizes.",
    time: "2:15 PM",
  },
  {
    id: "3",
    sender: "customer",
    senderName: "Marcus Brennan",
    initials: "MB",
    message:
      "8.5 × 11, full colour on both sides.",
    time: "2:16 PM",
  },
  {
    id: "4",
    sender: "admin",
    senderName: "Nisha Bhattarai",
    initials: "NB",
    message:
      "Thanks Marcus! I'll prepare a quote and send it over shortly.",
    time: "2:18 PM",
  },
];