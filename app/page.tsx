"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";
import type { Message } from "@/types/message";

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDemoAiResponse(userMessage: string): {
  message: string;
  suggestions: string[];
} {
  const text = userMessage.toLowerCase();

  if (text.includes("business card")) {
    return {
      message:
        "For business cards, I can help you choose the right size, cardstock, finish, and quantity. Most customers choose standard 3.5 x 2 inch cards with 14pt or 16pt cardstock. For a premium look, you can consider soft touch, foil, raised spot UV, or rounded corners.",
      suggestions: [
        "Show me premium business card finishes",
        "What paper is best for business cards?",
        "Do you offer same-day business cards?",
      ],
    };
  }

  if (text.includes("flyer") || text.includes("brochure")) {
    return {
      message:
        "For flyers and brochures, the best option depends on how they will be used. For handouts, lightweight glossy paper works well. For premium marketing, thicker paper with matte or gloss finish is better.",
      suggestions: [
        "What paper is best for flyers?",
        "Do you print folded brochures?",
        "Can you help with flyer design?",
      ],
    };
  }

  if (text.includes("specialist") || text.includes("human")) {
    return {
      message:
        "Of course. I can connect you with a print specialist for custom pricing, artwork review, large orders, or complex print requirements.",
      suggestions: [
        "Request a custom quote",
        "I need help with my artwork",
        "What information should I provide?",
      ],
    };
  }

  return {
    message:
      "Great question. I can help you choose the right print product, paper type, finish, quantity, and turnaround option based on your needs.",
    suggestions: [
      "I need business cards",
      "I need flyers or brochures",
      "Talk to a print specialist",
    ],
  };
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      message:
        "Hello! I'm your AI Print Assistant. I can help you with printing services, paper types, file formats, finishing options, turnaround times, and more. How can I assist you today?",
      time: "11:56 AM",
      suggestions: [
        "I need business cards",
        "I need flyers or brochures",
        "I want to talk to a print specialist",
      ],
    },
  ]);

  const addDemoAiResponse = (userMessage: string) => {
  const typingMessage: Message = {
    role: "ai",
    message: "",
    time: "",
    isTyping: true,
  };

  setMessages((prev) => [...prev, typingMessage]);

  setTimeout(() => {
    const demoResponse = getDemoAiResponse(userMessage);

    const aiMessage: Message = {
      role: "ai",
      message: demoResponse.message,
      time: getCurrentTime(),
      suggestions: demoResponse.suggestions,
    };

    setMessages((prev) => [
      ...prev.filter((message) => !message.isTyping),
      aiMessage,
    ]);
  }, 1000);
};

  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      role: "user",
      message,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    addDemoAiResponse(message);
  };

  const handleSuggestionClick = (question: string) => {
    const userMessage: Message = {
      role: "user",
      message: question,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    addDemoAiResponse(question);
  };

  return (
    <main className="h-screen flex flex-col bg-[#f6f7f9] overflow-hidden">
      <Header />
      <ChatArea
        messages={messages}
        onSuggestionClick={handleSuggestionClick}
      />
      <ChatInput onSendMessage={handleSendMessage} />
    </main>
  );
}