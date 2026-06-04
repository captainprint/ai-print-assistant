import MessageBubble from "./MessageBubble";

export default function ChatArea() {
  return (
    <section className="flex-1 overflow-y-auto">
      <div className="mw-full px-8 py-8 space-y-6">
        <MessageBubble
          role="ai"
          message="Hello! I'm your AI Print Assistant..."
          time="11:56 AM"
        />

        <MessageBubble
          role="user"
          message="I need business cards."
          time="11:57 AM"
        />
      </div>
    </section>
  );
}