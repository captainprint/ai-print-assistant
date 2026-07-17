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

export type SessionState = {
  sessionId: string;
  status: "active" | "completed" | "human_required";
  stage: string;
  messages: RawSessionMessage[];
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

export async function sendMessage(sessionId: string, message: string): Promise<SendMessageResponse> {
  return request<SendMessageResponse>("/api/v1/chat/message", {
    method: "POST",
    body: JSON.stringify({ sessionId, message }),
  });
}
