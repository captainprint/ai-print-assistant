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
  ApiError,
  type ConversationDetail,
} from "@/lib/conversations";

type ConversationPanelProps = {
  selectedConversationId?: string | null;
  onBack?: () => void;
  showBackButton?: boolean;
  refreshSignal?: number;
  onConversationChanged?: () => void;
};

export default function ConversationPanel({
  selectedConversationId,
  onBack,
  showBackButton = false,
  refreshSignal,
  onConversationChanged,
}: ConversationPanelProps) {
  const [isCustomerInfoOpen, setIsCustomerInfoOpen] = useState(false);
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [accessRevoked, setAccessRevoked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const loadConversation = useCallback((silent = false) => {
    if (!selectedConversationId) {
      setConversation(null);
      return;
    }

    if (!silent) {
      setLoading(true);
      setError(null);
      setAccessRevoked(false);
    }

    getConversation(selectedConversationId)
      .then((data) => {
        setConversation(data);
        setAccessRevoked(false);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 403) {
          // Reassigned/closed elsewhere and no longer visible to this staff
          // member — keep the last-known content, just lock interaction
          // down. It'll drop off the list on the next real reload.
          setAccessRevoked(true);
          return;
        }
        if (!silent) {
          setError(err instanceof Error ? err.message : "Failed to load conversation");
        }
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }, [selectedConversationId]);

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  // Silent background refresh (e.g. after an assignment/status change
  // elsewhere) — updates the conversation without showing a loading state.
  const isFirstRefresh = useRef(true);
  useEffect(() => {
    if (isFirstRefresh.current) {
      isFirstRefresh.current = false;
      return;
    }
    if (refreshSignal === undefined) return;
    loadConversation(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal]);

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

        {selectedConversationId && conversation && !accessRevoked && !conversation.assignedTo && !conversation.closedAt ? (
          <AssignmentGate
            sessionId={selectedConversationId}
            onAssigned={() => {
              loadConversation(true);
              onConversationChanged?.();
            }}
          />
        ) : (
          <div className="shrink-0">
            <ReplyComposer
              onSend={handleSend}
              disabled={!selectedConversationId || accessRevoked || !!conversation?.closedAt}
              disabledMessage={
                accessRevoked
                  ? "This conversation is assigned to someone in your team — reload to refresh your list."
                  : undefined
              }
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

            <CustomerInfo
              sessionId={selectedConversationId}
              refreshSignal={refreshSignal}
              onConversationChanged={onConversationChanged}
            />
          </aside>
        </div>
      )}
    </>
  );
}
