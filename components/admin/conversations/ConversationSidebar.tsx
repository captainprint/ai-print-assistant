import ConversationSearch from "./ConversationSearch";
import StatusFilter from "./StatusFilter";
import ConversationList from "./ConversationList";

type ConversationSidebarProps = {
  onSelectConversation?: (id: string) => void;
};

export default function ConversationSidebar({
    onSelectConversation,
}: ConversationSidebarProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col bg-white">
      <div className="shrink-0 border-b border-gray-200 p-4">
        <h2 className="text-base font-semibold text-gray-900">
          Conversations
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage customer chats
        </p>
      </div>

      <div className="shrink-0 border-b border-gray-200 p-4">
        <ConversationSearch />
      </div>

      <div className="shrink-0 border-b border-gray-200 p-4">
        <StatusFilter />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <ConversationList />
      </div>
    </aside>
  );
}