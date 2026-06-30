import ConversationSearch from "./ConversationSearch";

export default function ConversationSidebar() {
  return (
    <aside className="h-full bg-white">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-base font-semibold text-gray-900">
          Conversations
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage customer chats
        </p>
      </div>

      <div className="border-b border-gray-200 p-4">
        <ConversationSearch />
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-500">
          Sidebar content will be added here.
        </p>
      </div>
    </aside>
  );
}