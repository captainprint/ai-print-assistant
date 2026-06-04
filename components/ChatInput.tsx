import { Send } from "lucide-react";

export default function ChatInput() {
    return (
        <footer className="bg-white border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-8 py-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Not sure what to print? Ask me anything....."
              className="flex-1 h-14 rounded-xl border-2 border-[#3157F6] px-4 text-[15px] text-gray-900 placeholder:text-gray-500 outline-none"
            />

            <button className="w-14 h-14 rounded-xl bg-[#3157F6] text-white flex items-center justify-center hover:bg-[#8EA2FF] transition cursor-pointer">
              <Send size={24} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </footer>
    )
}