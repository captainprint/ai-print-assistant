"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import ConversationHeader from "./ConversationHeader";
import ConversationMessages from "./ConversationMessages";
import ReplyComposer from "./ReplyComposer";
import CustomerInfo from "./CustomerInfo";
import { mockMessages } from "@/data/mockMessages";
import { mockMarcusMessages } from "@/data/mockMarcusMessages";

type ConversationPanelProps = {
  selectedConversationId?: string | null;
  onBack?: () => void;
  showBackButton?: boolean;
};

export default function ConversationPanel({
  selectedConversationId,
  onBack,
  showBackButton = false,
}: ConversationPanelProps) {
  const [isCustomerInfoOpen, setIsCustomerInfoOpen] = useState(false);
  const messages =
    selectedConversationId === "1"
      ? mockMessages
      : selectedConversationId === "2"
        ? mockMarcusMessages
        : [];

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [selectedConversationId, messages.length]);


  return (
    <>
      <section className="flex h-full min-h-0 flex-col border-l border-gray-200 bg-white">
        <ConversationHeader
          onBack={onBack}
          showBackButton={showBackButton}
          onToggleCustomerInfo={() => setIsCustomerInfoOpen(true)}
        />

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#f6f7f9]">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              Conversation not available yet.
            </div>
          ) : (
            <ConversationMessages messages={messages} />
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0">
          <ReplyComposer />
        </div>
      </section>

      {isCustomerInfoOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity duration-300"
            onClick={() => setIsCustomerInfoOpen(false)}
          />

          <aside className="absolute right-0 top-0 h-full w-[320px] max-w-[90vw] animate-slide-in-right bg-white shadow-2xl">
            <button
              onClick={() => setIsCustomerInfoOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-lg p-1 text-gray-500 transition hover:bg-gray-100"
              aria-label="Close customer information"
            >
              <X size={18} />
            </button>

            <CustomerInfo />
          </aside>
        </div>
      )}
    </>
  );
}