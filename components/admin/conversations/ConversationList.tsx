import ConversationCard from "./ConversationCard";
import {
  deriveStatus,
  initialsFromName,
  relativeTime,
  type ConversationSummary,
} from "@/lib/conversations";

type ConversationListProps = {
  conversations: ConversationSummary[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedConversationId?: string | null;
  onSelectConversation?: (id: string) => void;
};

export default function ConversationList({
  conversations,
  loading,
  error,
  searchQuery,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-gray-500">
        Loading conversations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  const query = searchQuery.trim().toLowerCase();
  const filtered = query
    ? conversations.filter((conversation) => {
        const name = conversation.customerProfile?.name?.toLowerCase() ?? "";
        const email = conversation.customerProfile?.email?.toLowerCase() ?? "";
        const preview = conversation.preview?.toLowerCase() ?? "";
        return name.includes(query) || email.includes(query) || preview.includes(query);
      })
    : conversations;

  if (filtered.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-gray-500">
        No conversations found.
      </div>
    );
  }

  return (
    <div>
      {filtered.map((conversation) => (
        <ConversationCard
          key={conversation.sessionId}
          id={conversation.sessionId}
          name={conversation.customerProfile?.name || "Unknown customer"}
          initials={initialsFromName(conversation.customerProfile?.name)}
          time={relativeTime(conversation.lastActivityAt)}
          message={conversation.preview || "No messages yet"}
          status={deriveStatus(conversation)}
          active={conversation.sessionId === selectedConversationId}
          onClick={() => onSelectConversation?.(conversation.sessionId)}
        />
      ))}
    </div>
  );
}
