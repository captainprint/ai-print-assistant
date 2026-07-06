import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminSettingsPage() {
  return (
    <AdminLayout title="Settings" adminOnly>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Settings
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Settings page coming soon.
        </p>
      </div>
    </AdminLayout>
  );
}