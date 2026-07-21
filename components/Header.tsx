"use client";

import { useState } from "react";
import { MoreVertical, Printer, X } from "lucide-react";

type HeaderProps = {
  onCloseTicket?: () => void;
};

export default function Header({ onCloseTicket }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleClose = () => {
    window.parent.postMessage(
      { type: "close-ai-widget" },
      "*"
    );
  };

  return (
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
          {onCloseTicket && (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen((open) => !open)}
                className="text-gray-600 hover:text-[#3157F6] transition cursor-pointer"
                aria-label="More options"
              >
                <MoreVertical size={22} strokeWidth={2.2} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsConfirmOpen(true);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    End this conversation
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-red-500 transition cursor-pointer"
          >
            <X size={24} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-950">
              End this conversation?
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Your current conversation will be closed, and a new conversation will be started. Do you want to continue?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                No
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsConfirmOpen(false);
                  onCloseTicket?.();
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 cursor-pointer"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
