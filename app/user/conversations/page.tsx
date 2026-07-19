"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ConversationSidebar from "@/components/admin/conversations/ConversationSidebar";
import CustomerInfo from "@/components/admin/conversations/CustomerInfo";
import ConversationPanel from "@/components/admin/conversations/ConversationPanel";
import { usePolling } from "@/lib/usePolling";

const POLL_INTERVAL_MS = 6000;

function UserConversationsContent() {
  const searchParams = useSearchParams();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    () => searchParams.get("sessionId")
  );
  const [refreshSignal, setRefreshSignal] = useState(0);
  const handleConversationChanged = () => setRefreshSignal((v) => v + 1);

  // Poll so the list, chat panel, and customer info pick up new messages
  // and assignment/status changes without a manual refresh.
  usePolling(handleConversationChanged, POLL_INTERVAL_MS);

  return (
    <AdminLayout title="Conversations" noPadding>
      <div className="grid h-full min-h-0 overflow-hidden rounded-2xl border border-gray-200 bg-white lg:grid-cols-[380px_1fr] xl:grid-cols-[380px_1fr_280px]">

        {/* Conversation List */}
        <div
          className={`min-h-0 overflow-hidden ${
            selectedConversationId ? "hidden lg:block" : "block"
          }`}
        >
          <ConversationSidebar
            selectedConversationId={selectedConversationId}
            onSelectConversation={(id) => setSelectedConversationId(id)}
            refreshSignal={refreshSignal}
          />
        </div>

        {/* Chat Panel */}
        <div
          className={`min-h-0 overflow-hidden ${
            selectedConversationId ? "block" : "hidden lg:block"
          }`}
        >
          <ConversationPanel
            selectedConversationId={selectedConversationId}
            onBack={() => setSelectedConversationId(null)}
            showBackButton={!!selectedConversationId}
            refreshSignal={refreshSignal}
            onConversationChanged={handleConversationChanged}
          />
        </div>

        {/* Customer Info - Desktop Only */}
        <aside className="hidden min-h-0 overflow-hidden border-l border-gray-200 bg-white xl:block">
          <CustomerInfo
            sessionId={selectedConversationId}
            refreshSignal={refreshSignal}
            onConversationChanged={handleConversationChanged}
          />
        </aside>
      </div>
    </AdminLayout>
  );
}

export default function UserConversationsPage() {
  return (
    <Suspense fallback={null}>
      <UserConversationsContent />
    </Suspense>
  );
}
