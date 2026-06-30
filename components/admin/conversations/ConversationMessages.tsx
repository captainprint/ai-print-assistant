import { mockMessages } from "@/data/mockMessages";
import MessageBubble from "./MessageBubble"

export default function ConversationMessages() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f6f7f9] px-4 py-6 md:px-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs font-medium text-gray-400">Today</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="space-y-6">
        {mockMessages.map((message) => (
          <MessageBubble
            key={message.id}
            sender={message.sender as "customer" | "assistant"}
            message={message.message}
            time={message.time}
          />
        ))}
      </div>
    </div>
  );
}