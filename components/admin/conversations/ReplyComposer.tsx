import { Paperclip, Send } from "lucide-react";

export default function ReplyComposer() {
  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <textarea
          placeholder="Type your reply to the customer..."
          className="min-h-[90px] w-full resize-none px-5 py-4 text-sm text-gray-900 outline-none"
        />

        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-2">
          <button className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
            <Paperclip size={15} />
            Attach file
          </button>

          <button className="inline-flex items-center gap-1.5 rounded-full bg-[#a8b7ff] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#165DFC]">
            <Send size={14} />
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
}