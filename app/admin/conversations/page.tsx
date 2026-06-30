import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminConversationsPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] pt-[116px] md:pl-64 md:pt-0">
      <AdminSidebar />

      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
        <h1 className="text-lg font-semibold text-gray-900">
          Conversations
        </h1>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
          AC
        </div>
      </header>

      <section className="p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Conversations
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Conversation list will be added here.
          </p>
        </div>
      </section>
    </main>
  );
}