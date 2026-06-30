import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminConversationsPage() {
  return (
    <AdminLayout title="Conversations">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Conversations
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Conversation list will be added here.
        </p>
      </div>
    </AdminLayout>
  );
}