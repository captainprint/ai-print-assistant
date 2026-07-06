import { Search } from "lucide-react";

export default function ConversationSearch() {
  return (
    <div className="relative">
      <Search
        size={17}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search conversations..."
        className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}