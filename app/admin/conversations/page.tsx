import AdminLayout from "@/components/admin/AdminLayout";
import ConversationSidebar from "@/components/admin/conversations/ConversationSidebar";

export default function AdminConversationsPage() {
  return (
    <AdminLayout title="Conversations">
      <div className="grid min-h-[calc(100vh-112px)] overflow-hidden border border-gray-200 bg-white lg:grid-cols-[380px_1fr_260px]">
        <ConversationSidebar />

        <section className="border-l border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Conversation Area
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Chat details will be added here.
          </p>
        </section>

        <aside className="border-l border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Customer Info
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Customer details will be added here.
          </p>
        </aside>
      </div>
    </AdminLayout>
  );
}