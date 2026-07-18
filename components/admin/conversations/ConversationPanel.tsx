"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import ConversationHeader from "./ConversationHeader";
import ConversationMessages from "./ConversationMessages";
import ReplyComposer from "./ReplyComposer";
import CustomerInfo from "./CustomerInfo";
import AssignmentGate from "./AssignmentGate";
import {
  getConversation,
  sendStaffReply,
  mergeMessages,
  type ConversationDetail,
} from "@/lib/conversations";

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
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const loadConversation = useCallback(() => {
    if (!selectedConversationId) {
      setConversation(null);
      return;
    }

    setLoading(true);
    setError(null);

    getConversation(selectedConversationId)
      .then(setConversation)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load conversation");
      })
      .finally(() => setLoading(false));
  }, [selectedConversationId]);

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  const messages = conversation ? mergeMessages(conversation) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [selectedConversationId, messages.length]);

  async function handleSend(message: string) {
    if (!selectedConversationId) return;
    setSending(true);
    try {
      await sendStaffReply(selectedConversationId, message);
      loadConversation();
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <section className="flex h-full min-h-0 flex-col border-l border-gray-200 bg-white rounded-2xl">
        <ConversationHeader
          conversation={conversation}
          onBack={onBack}
          showBackButton={showBackButton}
          onToggleCustomerInfo={() => setIsCustomerInfoOpen(true)}
        />

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#f6f7f9]">
          {!selectedConversationId ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              Select a conversation to view messages.
            </div>
          ) : loading ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              Loading conversation...
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center text-red-600">
              {error}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              Conversation not available yet.
            </div>
          ) : (
            <ConversationMessages messages={messages} />
          )}
          <div ref={messagesEndRef} />
        </div>

        {selectedConversationId && conversation && !conversation.assignedTo && !conversation.closedAt ? (
          <AssignmentGate sessionId={selectedConversationId} onAssigned={loadConversation} />
        ) : (
          <div className="shrink-0">
            <ReplyComposer
              onSend={handleSend}
              disabled={!selectedConversationId || !!conversation?.closedAt}
              sending={sending}
            />
          </div>
        )}
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

            <CustomerInfo sessionId={selectedConversationId} />
          </aside>
        </div>
      )}
    </>
  );
}
