import { mockConversations } from "@/data/mockConversations";
import ConversationCard from "./ConversationCard";

export default function ConversationList() {
  return (
    <div className="overflow-y-auto">
      {mockConversations.map((conversation, index) => (
        <ConversationCard
          key={conversation.id}
          {...conversation}
          active={index === 0}
        />
      ))}
    </div>
  );
}