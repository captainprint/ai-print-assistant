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

  const addDemoAiResponse = () => {
    setTimeout(() => {
      const aiMessage: Message = {
        role: "ai",
        message:
          "Great question. I can help you choose the right print product, paper type, finish, quantity, and turnaround option based on your needs.",
        time: getCurrentTime(),
        suggestions: [
          "Show me premium options",
          "What paper do you recommend?",
          "Talk to a print specialist",
        ],
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 800);
  };

  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      role: "user",
      message,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    addDemoAiResponse();
  };

  const handleSuggestionClick = (question: string) => {
    const userMessage: Message = {
      role: "user",
      message: question,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    addDemoAiResponse();
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