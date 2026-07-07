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
        <button
          key={conversation.id}
          type="button"
          onClick={() => onSelectConversation?.(conversation.id)}
          className="block w-full text-left"
        >
          <ConversationCard
            {...conversation}
            active={conversation.id === selectedConversationId}
          />
        </button>
      ))}
    </div>
  );
}