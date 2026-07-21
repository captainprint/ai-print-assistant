import type { Message } from "@/types/message";
// (type-only import — types/message.ts imports back from here, also type-only,
// so this doesn't create a runtime circular dependency.)

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const SESSION_KEY = "chat_session_id";

export type ChatRecommendation = {
  productType: string;
  paperStock: string;
  finish: string;
  size: string;
  explanation: string;
  priceRange: string;
  tags: string[];
};

export type MatchedImage = {
  url: string;
  altText?: string;
  filename?: string;
};

export type MatchedImageGroup = {
  productType: string;
  images: MatchedImage[];
};

export type SendMessageResponse = {
  message: string;
  stage: "greeting" | "discovery" | "recommending" | "refining" | "completed";
  needsHuman: boolean;
  humanReason: string | null;
  recommendations: ChatRecommendation[];
  images: MatchedImageGroup[];
};

type RawSessionMessage = { role: "user" | "assistant" | "system"; content: string; timestamp: string };
type RawStaffReply = { message: string; staffName: string; timestamp: string };
type RawCustomerReply = { message: string; timestamp: string };

export type SessionState = {
  sessionId: string;
  status: "active" | "completed" | "human_required";
  stage: string;
  messages: RawSessionMessage[];
  // The backend returns the full session document — these are present even
  // though the anonymous chat flow didn't used to read them (see
  // mergeConversationMessages below).
  staffReplies: RawStaffReply[];
  customerReplies: RawCustomerReply[];
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || data.message || "Something went wrong. Please try again.");
  }

  return data as T;
}

export async function createSession(): Promise<string> {
  const data = await request<{ sessionId: string }>("/api/v1/chat/session", { method: "POST" });
  return data.sessionId;
}

export async function getSession(sessionId: string): Promise<SessionState | null> {
  try {
    return await request<SessionState>(`/api/v1/chat/session/${sessionId}`);
  } catch {
    return null;
  }
}

export async function getOrCreateSessionId(): Promise<string> {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) {
    const session = await getSession(existing);
    if (session) return existing;
  }

  const sessionId = await createSession();
  window.localStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

export async function closeSession(sessionId: string): Promise<{ success: boolean; closedAt: string }> {
  return request(`/api/v1/chat/session/${sessionId}/close`, { method: "POST" });
}

export function clearLocalSession(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(SESSION_KEY);
}

export async function sendMessage(sessionId: string, message: string): Promise<SendMessageResponse> {
  return request<SendMessageResponse>("/api/v1/chat/message", {
    method: "POST",
    body: JSON.stringify({ sessionId, message }),
  });
}

// Once a session has been escalated, further messages go to a human, not
// the AI — routed by sessionId (the same public capability the rest of this
// anonymous flow already relies on), no magic-link token required.
export async function sendCustomerReplyBySession(
  sessionId: string,
  message: string
): Promise<{ success: boolean; message: string }> {
  return request(`/api/v1/handoff/customer-reply-by-session/${sessionId}`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

// --- Resuming a handed-off conversation via a customer magic-link token ---
// This is a separate flow from the anonymous AI session above: once a staff
// member has replied, the conversation continues with a human, not the bot.

type CustomerProfile = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type ResumedConversation = {
  sessionId: string;
  status: "active" | "completed" | "human_required";
  customerProfile: CustomerProfile;
  messages: RawSessionMessage[];
  staffReplies: RawStaffReply[];
  customerReplies: RawCustomerReply[];
  customerToken: string;
};

export async function resumeConversation(token: string): Promise<ResumedConversation> {
  return request<ResumedConversation>(`/api/v1/handoff/resume/${token}`);
}

export async function sendCustomerReply(
  token: string,
  message: string
): Promise<{ success: boolean; message: string }> {
  return request(`/api/v1/handoff/customer-reply/${token}`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

type MergeableConversation = {
  messages: RawSessionMessage[];
  staffReplies: RawStaffReply[];
  customerReplies: RawCustomerReply[];
};

/**
 * Merges the AI-only messages with any staff/customer handoff replies into
 * one time-sorted list. Used both when resuming via a magic-link token and
 * when a returning visitor's own browser still has the session locally —
 * either way, a staff reply must be visible once it's happened.
 */
export function mergeConversationMessages(conversation: MergeableConversation): Message[] {
  type Timed = { role: "ai" | "user"; message: string; timestamp: string; senderName?: string };

  const fromMessages: Timed[] = conversation.messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "user" ? "user" : "ai",
      message: m.content,
      timestamp: m.timestamp,
    }));

  const fromStaff: Timed[] = conversation.staffReplies.map((r) => ({
    role: "ai",
    message: r.message,
    timestamp: r.timestamp,
    senderName: r.staffName,
  }));

  const fromCustomer: Timed[] = conversation.customerReplies.map((r) => ({
    role: "user",
    message: r.message,
    timestamp: r.timestamp,
  }));

  return [...fromMessages, ...fromStaff, ...fromCustomer]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(({ role, message, timestamp, senderName }) => ({
      role,
      message,
      time: formatTime(timestamp),
      senderName,
    }));
}
