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
        <div
          key={conversation.id}
          onClick={() => onSelectConversation?.(conversation.id)}
          className="cursor-pointer"
        >
          <ConversationCard
            {...conversation}
            active={conversation.id === selectedConversationId}
          />
        </div>
      ))}
    </div>
  );
}