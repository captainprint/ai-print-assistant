"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ConversationSidebar from "@/components/admin/conversations/ConversationSidebar";
import ConversationPanel from "@/components/admin/conversations/ConversationPanel";
import CustomerInfo from "@/components/admin/conversations/CustomerInfo";

export default function AdminConversationsPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <AdminLayout title="Conversations">
      <div className="grid h-[calc(100dvh-112px)] min-h-0 overflow-hidden border border-gray-200 bg-white lg:grid-cols-[380px_1fr] xl:grid-cols-[380px_1fr_280px]">
        
        {/* Conversation List */}
        <div
          className={`min-h-0 overflow-hidden ${
            selectedConversationId ? "hidden lg:block" : "block"
          }`}
        >
          <ConversationSidebar
          selectedConversationId={selectedConversationId}
            onSelectConversation={(id) => setSelectedConversationId(id)}
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
          />
        </div>

        {/* Customer Info - Desktop Only */}
        <aside className="hidden min-h-0 overflow-hidden border-l border-gray-200 bg-white xl:block">
          <CustomerInfo />
        </aside>
      </div>
    </AdminLayout>
  );
}