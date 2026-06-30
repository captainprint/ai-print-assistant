import AdminSidebar from "@/components/admin/AdminSidebar";

type AdminLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export default function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f7f9] pt-[132px] md:pl-64 md:pt-0">
      <AdminSidebar />

      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
          AC
        </div>
      </header>

      <section className="p-4 md:p-6">{children}</section>
    </main>
  );
}