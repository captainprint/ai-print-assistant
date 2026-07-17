import { apiFetch } from "@/lib/api";

export type CustomerProfile = {
  productType?: string | null;
  industry?: string | null;
  purpose?: string | null;
  style?: string | null;
  quantity?: string | null;
  budget?: string | null;
  timeline?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type AssignedStaff = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
} | null;

export type ConversationSummary = {
  sessionId: string;
  status: "active" | "completed" | "human_required";
  humanReason?: string | null;
  customerProfile: CustomerProfile;
  assignedTo: AssignedStaff;
  acceptedAt: string | null;
  closedAt: string | null;
  handoffNotifiedAt: string | null;
  createdAt: string;
  preview: string | null;
  lastActivityAt: string;
};

type RawMessage = { role: "user" | "assistant" | "system"; content: string; timestamp: string };
type RawStaffReply = { message: string; staffId?: string | null; staffName: string; timestamp: string };
type RawCustomerReply = { message: string; timestamp: string };

export type ConversationDetail = {
  sessionId: string;
  status: "active" | "completed" | "human_required";
  humanReason?: string | null;
  customerProfile: CustomerProfile;
  messages: RawMessage[];
  staffReplies: RawStaffReply[];
  customerReplies: RawCustomerReply[];
  assignedTo: AssignedStaff;
  acceptedAt: string | null;
  closedAt: string | null;
  handoffNotifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AssignableUser = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
};

export type DisplayStatus = "New" | "Open" | "Resolved";

export type MergedMessage = {
  id: string;
  sender: "customer" | "ai" | "admin";
  senderName: string;
  initials: string;
  message: string;
  time: string;
  timestamp: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data as T;
}

export function deriveStatus(conversation: {
  assignedTo: AssignedStaff;
  closedAt: string | null;
}): DisplayStatus {
  if (conversation.closedAt) return "Resolved";
  if (conversation.assignedTo) return "Open";
  return "New";
}

export function initialsFromName(name?: string | null): string {
  if (!name) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function mergeMessages(conversation: ConversationDetail): MergedMessage[] {
  const customerName = conversation.customerProfile?.name || "Customer";
  const customerInitials = initialsFromName(conversation.customerProfile?.name);

  const fromMessages: MergedMessage[] = conversation.messages
    .filter((m) => m.role !== "system")
    .map((m, i) => ({
      id: `m-${i}-${m.timestamp}`,
      sender: m.role === "user" ? "customer" : "ai",
      senderName: m.role === "user" ? customerName : "AI Assistant",
      initials: m.role === "user" ? customerInitials : "AI",
      message: m.content,
      time: formatTime(m.timestamp),
      timestamp: m.timestamp,
    }));

  const fromStaff: MergedMessage[] = conversation.staffReplies.map((r, i) => ({
    id: `s-${i}-${r.timestamp}`,
    sender: "admin",
    senderName: r.staffName,
    initials: initialsFromName(r.staffName),
    message: r.message,
    time: formatTime(r.timestamp),
    timestamp: r.timestamp,
  }));

  const fromCustomer: MergedMessage[] = conversation.customerReplies.map((r, i) => ({
    id: `c-${i}-${r.timestamp}`,
    sender: "customer",
    senderName: customerName,
    initials: customerInitials,
    message: r.message,
    time: formatTime(r.timestamp),
    timestamp: r.timestamp,
  }));

  return [...fromMessages, ...fromStaff, ...fromCustomer].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function relativeTime(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;

  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;

  const diffDay = Math.round(diffHr / 24);
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d`;

  const diffWeek = Math.round(diffDay / 7);
  return `${diffWeek}w`;
}

export async function listConversations(
  status: "all" | "unassigned" | "assigned" | "closed",
  page = 1
): Promise<{ conversations: ConversationSummary[]; total: number; page: number; pages: number }> {
  return request(`/api/v1/handoff/conversations?status=${status}&page=${page}&limit=20`);
}

export async function getConversation(sessionId: string): Promise<ConversationDetail> {
  return request(`/api/v1/handoff/conversations/${sessionId}`);
}

export async function sendStaffReply(
  sessionId: string,
  message: string
): Promise<{ success: boolean; message: string }> {
  return request(`/api/v1/handoff/reply/${sessionId}`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function closeConversation(
  sessionId: string
): Promise<{ success: boolean; closedAt: string }> {
  return request(`/api/v1/handoff/close/${sessionId}`, { method: "POST" });
}

export async function assignConversation(
  sessionId: string,
  userId: string
): Promise<{ success: boolean; assignedTo: AssignedStaff }> {
  return request(`/api/v1/handoff/conversations/${sessionId}/assign`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export async function unassignConversation(
  sessionId: string
): Promise<{ success: boolean; message: string }> {
  return request(`/api/v1/handoff/unassign/${sessionId}`, { method: "POST" });
}

export async function listAssignableUsers(): Promise<{ users: AssignableUser[] }> {
  return request(`/api/v1/handoff/assignable-users`);
}
