"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import ConversationSidebar from "@/components/admin/conversations/ConversationSidebar";
import CustomerInfo from "@/components/admin/conversations/CustomerInfo";
import ConversationPanel from "@/components/admin/conversations/ConversationPanel";

export default function UserConversationsPage() {
  return (
    <AdminLayout title="Conversations">
      <div className="grid min-h-[calc(100vh-112px)] overflow-hidden border border-gray-200 bg-white lg:grid-cols-[380px_1fr] xl:grid-cols-[380px_1fr_280px]">
        <ConversationSidebar />

        <ConversationPanel />

        <aside className="hidden w-[280px] shrink-0 border-l border-gray-200 bg-white xl:block">
          <CustomerInfo />
        </aside>
      </div>
    </AdminLayout>
  );
}