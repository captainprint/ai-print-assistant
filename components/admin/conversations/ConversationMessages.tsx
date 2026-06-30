export default function ConversationMessages() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f6f7f9] px-4 py-6 md:px-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs font-medium text-gray-400">Today</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center">
        <p className="text-sm text-gray-500">
          Messages will be displayed here.
        </p>
      </div>
    </div>
  );
}