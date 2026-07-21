"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";
import {
  getOrCreateSessionId,
  getSession,
  sendMessage,
  sendCustomerReplyBySession,
  resumeConversation,
  sendCustomerReply,
  mergeConversationMessages,
  closeSession,
  clearLocalSession,
} from "@/lib/chat";
import { usePolling } from "@/lib/usePolling";
import type { Message } from "@/types/message";

const POLL_INTERVAL_MS = 10000;

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

const GREETING: Message = {
  role: "ai",
  message:
    "Hey! I'm Alex, your print assistant. I can help you with printing services, paper types, file formats, finishing options, turnaround times, and more. How can I assist you today?",
  time: getCurrentTime(),
  suggestions: [
    "I need business cards",
    "I need flyers or brochures",
    "I want to talk to a print specialist",
  ],
};

function HomeContent() {
  const searchParams = useSearchParams();
  const resumeToken = searchParams.get("t");

  const [isAiTyping, setIsAiTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isHumanRequired, setIsHumanRequired] = useState(false);
  const [hasStaffReplied, setHasStaffReplied] = useState(false);
  const [sendingHumanReply, setSendingHumanReply] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() =>
    resumeToken ? [] : [GREETING]
  );

  const [isResuming, setIsResuming] = useState(!!resumeToken);
  const [resumeStatus, setResumeStatus] = useState<
    "active" | "completed" | "human_required" | null
  >(null);
  const [resumeSessionId, setResumeSessionId] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (resumeToken) {
        try {
          const conversation = await resumeConversation(resumeToken);
          if (cancelled) return;
          setResumeStatus(conversation.status);
          setResumeSessionId(conversation.sessionId);
          setMessages(mergeConversationMessages(conversation));
        } catch (err) {
          if (cancelled) return;
          setResumeError(
            err instanceof Error
              ? err.message
              : "Unable to load this conversation."
          );
        } finally {
          if (!cancelled) setIsResuming(false);
        }
        return;
      }

      const id = await getOrCreateSessionId();
      const session = await getSession(id);

      if (cancelled) return;

      if (session && session.messages.length > 0) {
        setMessages(mergeConversationMessages(session));
        setIsHumanRequired(session.status === "human_required");
        setHasStaffReplied(session.staffReplies.length > 0);
      }

      setSessionId(id);
    })();

    return () => {
      cancelled = true;
    };
  }, [resumeToken]);

  async function handleResumedReply(message: string) {
    if (!resumeToken || sendingReply || resumeStatus === "completed") return;

    const userMessage: Message = {
      role: "user",
      message,
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setSendingReply(true);

    try {
      await sendCustomerReply(resumeToken, message);
      const refreshed = await resumeConversation(resumeToken);
      setResumeStatus(refreshed.status);
      setMessages(mergeConversationMessages(refreshed));
    } catch (err) {
      const errorMessage: Message = {
        role: "ai",
        message:
          err instanceof Error
            ? err.message
            : "Failed to send. Please try again.",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setSendingReply(false);
    }
  }

  async function handleHumanReply(message: string) {
    if (!sessionId || sendingHumanReply) return;

    const userMessage: Message = {
      role: "user",
      message,
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setSendingHumanReply(true);

    try {
      await sendCustomerReplyBySession(sessionId, message);
      const refreshed = await getSession(sessionId);
      if (refreshed) {
        setMessages(mergeConversationMessages(refreshed));
        setIsHumanRequired(refreshed.status === "human_required");
        setHasStaffReplied(refreshed.staffReplies.length > 0);
      }
    } catch (err) {
      const errorMessage: Message = {
        role: "ai",
        message:
          err instanceof Error
            ? err.message
            : "Failed to send. Please try again.",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setSendingHumanReply(false);
    }
  }

  async function handleCloseTicket() {
    const idToClose = resumeToken ? resumeSessionId : sessionId;
    if (!idToClose) return;

    try {
      await closeSession(idToClose);
    } catch {
      // best-effort — still reset the customer's local view even if this
      // fails; a fresh session gets created on their next message either way
    }

    if (resumeToken) {
      setResumeStatus("completed");
    } else {
      clearLocalSession();
      setMessages([GREETING]);
      setIsHumanRequired(false);
      setHasStaffReplied(false);
      setSessionId(await getOrCreateSessionId());
    }
  }

  async function handleAiMessage(message: string) {
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

  // Poll while resuming via a magic-link token — a reply can arrive from
  // staff at any point without any action on the customer's end.
  usePolling(() => {
    if (!resumeToken || isResuming || resumeError || sendingReply || resumeStatus === "completed") return;
    resumeConversation(resumeToken)
      .then((conversation) => {
        setResumeStatus(conversation.status);
        setMessages(mergeConversationMessages(conversation));
      })
      .catch(() => {});
  }, POLL_INTERVAL_MS);

  // Poll the anonymous session once it's been escalated — same reasoning,
  // but only once there's a human involved; the AI itself always answers
  // synchronously so there's nothing to poll for before that.
  usePolling(() => {
    if (resumeToken || !sessionId || !isHumanRequired || sendingHumanReply) return;
    getSession(sessionId)
      .then((session) => {
        if (!session) return;
        setMessages(mergeConversationMessages(session));
        setIsHumanRequired(session.status === "human_required");
        setHasStaffReplied(session.staffReplies.length > 0);
      })
      .catch(() => {});
  }, POLL_INTERVAL_MS);

  // Once a staff member has replied, the customer keeps talking to them, not
  // the bot — before that first reply, there's nothing to hand the message
  // to yet, so the input stays disabled with a "we'll follow up" notice.
  const waitingForFirstReply = isHumanRequired && !hasStaffReplied;

  // Menu only makes sense once there's an actual conversation to close —
  // a session exists from the moment the widget loads, before the customer
  // has said anything.
  const hasCustomerMessage = messages.some((m) => m.role === "user");

  const handleSendMessage = resumeToken
    ? handleResumedReply
    : isHumanRequired && hasStaffReplied
    ? handleHumanReply
    : handleAiMessage;

  if (resumeToken && resumeError) {
    return (
      <main className="h-screen flex flex-col bg-[#f6f7f9] overflow-hidden">
        <Header />
        <div className="flex-1 flex items-center justify-center px-8 text-center">
          <p className="text-gray-600">{resumeError}</p>
        </div>
      </main>
    );
  }

  if (resumeToken && isResuming) {
    return (
      <main className="h-screen flex flex-col bg-[#f6f7f9] overflow-hidden">
        <Header />
        <div className="flex-1 flex items-center justify-center px-8 text-center text-gray-500">
          Loading your conversation...
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen flex flex-col bg-[#f6f7f9] overflow-hidden">
      <Header onCloseTicket={hasCustomerMessage ? handleCloseTicket : undefined} />
      <ChatArea messages={messages} onSuggestionClick={handleSendMessage} />
      <ChatInput
        onSendMessage={handleSendMessage}
        isAiTyping={
          resumeToken ? sendingReply : hasStaffReplied ? sendingHumanReply : isAiTyping
        }
        disabled={resumeToken ? resumeStatus === "completed" : waitingForFirstReply}
        disabledReason={
          resumeToken
            ? "This conversation has been resolved."
            : "Our team will be in touch by email shortly."
        }
      />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
