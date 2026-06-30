import AdminLayout from "@/components/admin/AdminLayout";
import ConversationSidebar from "@/components/admin/conversations/ConversationSidebar";
import ConversationHeader from "@/components/admin/conversations/ConversationHeader";

export default function AdminConversationsPage() {
    return (
        <AdminLayout title="Conversations">
            <div className="grid min-h-[calc(100vh-112px)] overflow-hidden border border-gray-200 bg-white lg:grid-cols-[380px_1fr_260px]">
                <ConversationSidebar />

                <section className="flex flex-col border-l border-gray-200 bg-white">
                    <ConversationHeader />

                    <div className="flex-1 p-6">
                        <p className="text-sm text-gray-500">
                            Messages will be displayed here.
                        </p>
                    </div>
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