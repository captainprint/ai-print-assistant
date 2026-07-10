import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard" noPadding>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Admin Dashboard
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Dashboard content will be added here.
        </p>
      </div>
    </AdminLayout>
  );
}