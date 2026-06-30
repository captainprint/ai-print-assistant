import AdminLayout from "@/components/admin/AdminLayout";
import ConversationSidebar from "@/components/admin/conversations/ConversationSidebar";
import ConversationHeader from "@/components/admin/conversations/ConversationHeader";
import ConversationMessages from "@/components/admin/conversations/ConversationMessages";
import ReplyComposer from "@/components/admin/conversations/ReplyComposer";
import CustomerInfo from "@/components/admin/conversations/CustomerInfo";

export default function AdminConversationsPage() {
    return (
        <AdminLayout title="Conversations">
            <div className="grid min-h-[calc(100vh-112px)] overflow-hidden border border-gray-200 bg-white lg:grid-cols-[380px_1fr] xl:grid-cols-[380px_1fr_280px]">
                <ConversationSidebar />


                <section className="flex flex-col border-l border-gray-200 bg-white">
                    <ConversationHeader />
                    <ConversationMessages />
                    <ReplyComposer />
                </section>

                <aside className="hidden xl:block w-[280px] shrink-0 border-l border-gray-200 bg-white">
                    <CustomerInfo />
                </aside>
            </div>
        </AdminLayout>
    );
}