"use client";

import { CircleHelp, Printer, X, UserRound, Send } from "lucide-react";


export default function Home() {
  const handleClose = () => {
    window.parent.postMessage(
      { type: "close-ai-widget" },
      "*"
    );
  };

  return (
    <main className="h-screen flex flex-col bg-[#f6f7f9] overflow-hidden">
      {/* Header */}
      <header className="h-24 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#3157F6] flex items-center justify-center text-white">
              <Printer size={24} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-[22px] leading-tight font-bold text-gray-950">
                AI Print Assistant
              </h1>

              <p className="text-[14px] text-gray-500 mt-1">
                Online • Ready to help
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-[#3157F6] transition cursor-pointer">
              <CircleHelp size={22} strokeWidth={2.2} />
            </button>

            <button
              onClick={handleClose}
              className="text-gray-600 hover:text-red-500 transition cursor-pointer"
            >
              <X size={24} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <section className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-8 py-8 space-y-6">

          {/* AI Message */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#3157F6] text-white flex items-center justify-center text-sm font-semibold shrink-0">
              AI
            </div>

            <div className="max-w-[520px] rounded-xl bg-white border border-gray-200 px-5 py-4 shadow-sm">
              <p className="text-[16px] leading-relaxed text-gray-900">
                Hello! I&apos;m your AI Print Assistant. I can help you with printing
                services, paper types, file formats, finishing options, turnaround
                times, and more. How can I assist you today?
              </p>

              <p className="text-xs text-gray-500 mt-3">
                11:56 AM
              </p>
            </div>
          </div>

          {/* User Message */}
          <div className="flex justify-end items-start gap-3">
            <div className="max-w-[520px] rounded-xl bg-[#344054] px-5 py-4 shadow-sm">
              <p className="text-[16px] leading-relaxed text-white">
                I need business cards for my construction company.
              </p>

              <p className="text-xs text-gray-200 mt-3">
                11:57 AM
              </p>
            </div>

            <div className="w-9 h-9 rounded-full bg-[#344054] text-white flex items-center justify-center shrink-0">
              <UserRound size={18} />
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
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
    </main>
  );
}