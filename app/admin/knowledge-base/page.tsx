import AdminLayout from "@/components/admin/AdminLayout";

export default function KnowledgeBasePage() {
  return (
    <AdminLayout title="Knowledge Base" noPadding>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
        <h2 className="text-lg font-semibold text-gray-900">Knowledge Base</h2>
        <p className="mt-2 text-sm text-gray-500">
          Upload files that your AI assistant can use to answer customer questions.
        </p>
      </div>
    </AdminLayout>
  );
}