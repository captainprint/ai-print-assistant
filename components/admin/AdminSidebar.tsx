"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  MessageSquare,
  Printer,
  Users,
  KeyRound,
  LogOut,
  ChevronUp,
  BookOpen
} from "lucide-react";

import { getInitials } from "@/lib/adminAuth";
import type { AdminUser } from "@/lib/adminAuth";

type AdminSidebarProps = {
  onLogout: () => void;
  user: AdminUser | null;
};

const ADMIN_NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/knowledge-base", label: "Knowledge Base", icon: BookOpen },
];

const USER_NAV_ITEMS = [
  { href: "/user/conversations", label: "Conversations", icon: MessageSquare },
];

export default function AdminSidebar({ onLogout, user }: AdminSidebarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const pathname = usePathname();

  const role = user?.role;
  const navItems = role === "admin" ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;
  const displayName = user?.fullName || user?.username || user?.email || "";
  const roleLabel = role === "admin" ? "Admin" : "User";
  const initials = user ? getInitials(user) : "";

  return (
    <aside className="fixed left-0 top-0 z-40 w-full border-b border-gray-200 bg-white md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex h-16 items-center justify-between px-4 md:border-b md:border-gray-200 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Printer size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              AI Print
            </p>
            <p className="text-sm text-gray-500">
              Assistant
            </p>
          </div>
        </div>

        {/* Mobile user menu */}
        <div className="relative md:hidden">
          {isUserMenuOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="text-sm font-semibold text-gray-900">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500">
                  {roleLabel}
                </p>
              </div>

              <button className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <KeyRound size={16} />
                Change Password
              </button>

              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
          >
            {initials}
          </button>
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
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors md:gap-3 ${active
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out pinned at bottom on desktop */}
        <div className="relative hidden px-3 pb-5 md:block">
          {isUserMenuOpen && (
            <div className="absolute bottom-[72px] left-3 right-3 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <KeyRound size={16} />
                Change password
              </button>

              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-gray-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800">
                {displayName}
              </p>
              <p className="text-xs text-gray-500">{roleLabel}</p>
            </div>

            <ChevronUp size={16} className="text-gray-400" />
          </button>
        </div>
      </div>
    </aside>
  );
}
