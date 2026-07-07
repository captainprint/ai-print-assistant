import MessageBubble from "./MessageBubble";

type Message = {
  id: string;
  sender: "customer" | "ai" | "admin";
  senderName: string;
  initials: string;
  message: string;
  time: string;
};

type ConversationMessagesProps = {
  messages: Message[];
};

export default function ConversationMessages({
  messages,
}: ConversationMessagesProps) {
  return (
    <div className="min-h-full bg-[#f6f7f9] px-4 py-6 md:px-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs font-medium text-gray-400">Today</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="space-y-6">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            sender={message.sender}
            senderName={message.senderName}
            initials={message.initials}
            message={message.message}
            time={message.time}
          />
        ))}
      </div>
    </div>
  );
}