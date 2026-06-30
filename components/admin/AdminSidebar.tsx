import Link from "next/link";
import { LayoutDashboard, MessageSquare, Settings, Printer } from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Printer size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">AI Print</p>
          <p className="text-sm text-gray-500">Assistant</p>
        </div>
      </div>

      <nav className="space-y-1 px-3 py-5">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          href="/admin/conversations"
          className="flex items-center gap-3 rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600"
        >
          <MessageSquare size={18} />
          Conversations
        </Link>

        <Link
          href="/admin/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          <Settings size={18} />
          Settings
        </Link>
      </nav>
    </aside>
  );
}