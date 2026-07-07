"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getUser, clearAuth, getInitials } from "@/lib/adminAuth";
import type { AdminUser } from "@/lib/adminAuth";

type AdminLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export default function AdminLayout({ title, children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/u/login");
      return;
    }
    if (pathname.startsWith("/admin") && u.role !== "admin") {
      router.replace("/user/conversations");
      return;
    }
    if (pathname.startsWith("/user") && u.role === "admin") {
      router.replace("/admin/dashboard");
      return;
    }
    setUser(u);
  }, [router, pathname]);

  function handleLogout() {
    clearAuth();
    router.push("/u/login");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f7f9] pt-[132px] md:pl-64 md:pt-0">
      <AdminSidebar onLogout={handleLogout} role={user?.role} />

      <section className="p-4 md:p-6">{children}</section>
    </main>
  );
}
