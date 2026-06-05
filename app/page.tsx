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
    },
    {
      role: "user",
      message:
        "I need business cards. Can you help me with that?",
      time: "11:57 AM",
    },
    {
      role: "ai",
      message:
        "Sure! For business cards, I can help you choose the right size, paper type, finish, quantity, and turnaround time. Do you want something standard and affordable, or something premium like foil, raised spot UV, or soft touch?",
      time: "11:58 AM",
    },
    {
      role: "ai",
      message:
        "Hello! I'm your AI Print Assistant. I can help you with printing services, paper types, file formats, finishing options, turnaround times, and more. How can I assist you today?",
      time: "11:56 AM",
    },
    {
      role: "user",
      message:
        "I need business cards. Can you help me with that?",
      time: "11:57 AM",
    },
    {
      role: "ai",
      message:
        "Sure! For business cards, I can help you choose the right size, paper type, finish, quantity, and turnaround time. Do you want something standard and affordable, or something premium like foil, raised spot UV, or soft touch?",
      time: "11:58 AM",
    },
  ]);

  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      role: "user",
      message,
      time: getCurrentTime(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
  };

  return (
    <main className="h-screen flex flex-col bg-[#f6f7f9] overflow-hidden">
      <Header />
      <ChatArea messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </main>
  );
}