import { mockConversations } from "@/data/mockConversations";
import ConversationCard from "./ConversationCard";

type ConversationListProps = {
  selectedConversationId?: string | null;
  onSelectConversation?: (id: string) => void;
};

export default function ConversationList({
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <div>
      {mockConversations.map((conversation) => (
        <ConversationCard
          key={conversation.id}
          {...conversation}
          active={conversation.id === selectedConversationId}
          onClick={() => onSelectConversation?.(conversation.id)}
        />
      ))}
    </div>
  );
}