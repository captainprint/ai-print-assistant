"use client";

import { ArrowLeft, Info } from "lucide-react";

type ConversationHeaderProps = {
  onBack?: () => void;
  showBackButton?: boolean;
  onToggleCustomerInfo: () => void;
};

export default function ConversationHeader({
  onBack,
  showBackButton,
  onToggleCustomerInfo,
}: ConversationHeaderProps) {
  return (
    <header className="flex min-w-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 md:px-6 md:py-4">
      <div className="flex min-w-0 items-center gap-3">
        {showBackButton && (
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 xl:hidden"
            aria-label="Back to conversations"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 md:h-12 md:w-12">
          SM
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-gray-900 md:text-base">
            Sarah Mitchell
          </h2>

          <p className="truncate text-xs text-gray-500 md:text-sm">
            sarah.mitchell@designco.com
          </p>
        </div>
      </div>

      <button
        onClick={onToggleCustomerInfo}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 md:h-10 md:w-10 xl:hidden"
        aria-label="Customer information"
      >
        <Info size={18} />
      </button>
    </header>
  );
}