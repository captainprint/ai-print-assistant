import AdminLayout from "@/components/admin/AdminLayout";
import ConversationSidebar from "@/components/admin/conversations/ConversationSidebar";
import ConversationHeader from "@/components/admin/conversations/ConversationHeader";
import ConversationMessages from "@/components/admin/conversations/ConversationMessages";
import ReplyComposer from "@/components/admin/conversations/ReplyComposer";
import CustomerInfo from "@/components/admin/conversations/CustomerInfo";
import ConversationPanel from "@/components/admin/conversations/ConversationPanel";

export default function AdminConversationsPage() {
    return (
        <AdminLayout title="Conversations">
      <div className="grid h-[calc(100dvh-112px)] min-h-0 overflow-hidden border border-gray-200 bg-white lg:grid-cols-[380px_1fr] xl:grid-cols-[380px_1fr_280px]">
        <div className="min-h-0 overflow-hidden">
          <ConversationSidebar />
        </div>

        <div className="min-h-0 overflow-hidden">
          <ConversationPanel />
        </div>

        <aside className="hidden min-h-0 overflow-hidden border-l border-gray-200 bg-white xl:block">
          <CustomerInfo />
        </aside>
      </div>
    </AdminLayout>
    );
}