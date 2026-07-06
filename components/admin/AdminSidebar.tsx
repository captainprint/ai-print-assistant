"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Printer,
  Users,
  LogOut,
} from "lucide-react";

type AdminSidebarProps = {
  onLogout: () => void;
};

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/conversations", label: "Conversations", icon: MessageSquare },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 w-full border-b border-gray-200 bg-white md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex h-16 items-center gap-3 px-4 md:border-b md:border-gray-200 md:px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Printer size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">AI Print</p>
          <p className="text-sm text-gray-500">Assistant</p>
        </div>
      </div>

      {/* Mobile: horizontal scrollable tabs + logout at end
          Desktop: vertical list with logout pinned to bottom */}
      <div className="flex h-[calc(100%-4rem)] flex-col justify-between">
        <nav className="flex gap-2 overflow-x-auto px-3 pb-3 md:block md:space-y-1 md:px-3 md:py-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors md:gap-3 ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}

          {/* Sign out visible on mobile (in the nav row) */}
          <button
            onClick={onLogout}
            className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </nav>

        {/* Sign out pinned at bottom on desktop */}
        <div className="hidden px-3 pb-5 md:block">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
