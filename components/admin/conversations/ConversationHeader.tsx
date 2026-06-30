import { ChevronDown } from "lucide-react";

export default function ConversationHeader() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          SM
        </div>

        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Sarah Mitchell
          </h2>

          <p className="text-sm text-gray-500">
            sarah.mitchell@designco.com
          </p>
        </div>
      </div>

      <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
        New
        <ChevronDown size={16} />
      </button>
    </header>
  );
}