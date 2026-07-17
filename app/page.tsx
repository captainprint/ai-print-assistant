"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";
import { getOrCreateSessionId, getSession, sendMessage } from "@/lib/chat";
import type { Message } from "@/types/message";

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTimestamp(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

const GREETING: Message = {
  role: "ai",
  message:
    "Hello! I'm your AI Print Assistant. I can help you with printing services, paper types, file formats, finishing options, turnaround times, and more. How can I assist you today?",
  time: getCurrentTime(),
  suggestions: [
    "I need business cards",
    "I need flyers or brochures",
    "I want to talk to a print specialist",
  ],
};

export default function Home() {
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isHumanRequired, setIsHumanRequired] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const id = await getOrCreateSessionId();
      const session = await getSession(id);

      if (cancelled) return;

      if (session && session.messages.length > 0) {
        const hydrated: Message[] = session.messages
          .filter((m) => m.role !== "system")
          .map((m) => ({
            role: m.role === "user" ? "user" : "ai",
            message: m.content,
            time: formatTimestamp(m.timestamp),
          }));
        setMessages(hydrated);
        setIsHumanRequired(session.status === "human_required");
      }

      setSessionId(id);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSendMessage(message: string) {
    if (!sessionId || isAiTyping || isHumanRequired) return;

    const userMessage: Message = {
      role: "user",
      message,
      time: getCurrentTime(),
    };

    setIsAiTyping(true);
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "ai", message: "", time: "", isTyping: true },
    ]);

    try {
      const response = await sendMessage(sessionId, message);

      const aiMessage: Message = {
        role: "ai",
        message: response.message,
        time: getCurrentTime(),
        recommendations: response.recommendations,
        images: response.images,
      };

      setMessages((prev) => [...prev.filter((m) => !m.isTyping), aiMessage]);

      if (response.needsHuman) {
        setIsHumanRequired(true);
      }
    } catch (err) {
      const errorMessage: Message = {
        role: "ai",
        message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev.filter((m) => !m.isTyping), errorMessage]);
    } finally {
      setIsAiTyping(false);
    }
  }

  return (
    <main className="h-screen flex flex-col bg-[#f6f7f9] overflow-hidden">
      <Header />
      <ChatArea messages={messages} onSuggestionClick={handleSendMessage} />
      <ChatInput
        onSendMessage={handleSendMessage}
        isAiTyping={isAiTyping}
        disabled={isHumanRequired}
        disabledReason="Our team will be in touch by email shortly."
      />
    </main>
  );
}
