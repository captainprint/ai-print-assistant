"use client";

import { useEffect, useState } from "react";
import { Plus, MoreHorizontal, X, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { apiFetch } from "@/lib/api";
import type { User, UserRole } from "@/types/user";

type UserFormState = {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
};

const emptyForm: UserFormState = {
  fullName: "",
  email: "",
  phone: "",
  role: "user",
  password: "",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadUsers() {
    setLoading(true);
    setListError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (search) params.set("search", search);

      const res = await apiFetch(`/api/v1/admin/users?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setListError(data.message || "Failed to load users.");
        return;
      }

      setUsers(data.users);
      setPages(data.pages || 1);
    } catch {
      setListError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      loadUsers();
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function openCreateModal() {
    setEditingUser(null);
    setForm(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  }

  function openEditModal(user: User) {
    setEditingUser(user);
    setForm({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: "",
    });
    setFormError("");
    setOpenMenuId(null);
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    try {
      const isEdit = !!editingUser;
      const body: Record<string, string> = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        role: form.role,
      };
      if (form.password || !isEdit) body.password = form.password;

      const res = await apiFetch(
        isEdit ? `/api/v1/admin/users/${editingUser!._id}` : "/api/v1/admin/users",
        {
          method: isEdit ? "PUT" : "POST",
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Failed to save user.");
        return;
      }

      setIsModalOpen(false);
      loadUsers();
    } catch {
      setFormError("Unable to connect to server.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(user: User) {
    setOpenMenuId(null);
    if (!window.confirm(`Delete ${user.fullName}? This cannot be undone.`)) return;

    setDeletingId(user._id);
    try {
      const res = await apiFetch(`/api/v1/admin/users/${user._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setListError(data.message || "Failed to delete user.");
        return;
      }
      loadUsers();
    } catch {
      setListError("Unable to connect to server.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminLayout title="Users">
      <div className="border border-gray-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage staff users and access.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
            />

            <button
              onClick={openCreateModal}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
            >
              <Plus size={16} />
              Add User
            </button>
          </div>
        </div>

        {listError && (
          <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 md:px-6">
            {listError}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
            <Loader2 size={16} className="animate-spin" />
            Loading users…
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            No users found.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3 md:px-6">Name</th>
                    <th className="px-4 py-3 md:px-6">Email</th>
                    <th className="px-4 py-3 md:px-6">Phone</th>
                    <th className="px-4 py-3 md:px-6">Role</th>
                    <th className="px-4 py-3 md:px-6">Status</th>
                    <th className="px-4 py-3 text-right md:px-6">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900 md:px-6">
                        {user.fullName}
                      </td>
                      <td className="px-4 py-4 text-gray-700 md:px-6">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 text-gray-700 md:px-6">
                        {user.phone}
                      </td>
                      <td className="px-4 py-4 md:px-6">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-4 py-4 md:px-6">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            user.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="relative px-4 py-4 text-right md:px-6">
                        <button
                          onClick={() =>
                            setOpenMenuId(openMenuId === user._id ? null : user._id)
                          }
                          disabled={deletingId === user._id}
                          className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                          {deletingId === user._id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <MoreHorizontal size={18} />
                          )}
                        </button>

                        {openMenuId === user._id && (
                          <div className="absolute right-16 top-1/2 z-20 w-36 -translate-y-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 text-left shadow-xl shadow-gray-200/70">
                            <button
                              onClick={() => openEditModal(user)}
                              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Edit user
                            </button>

                            <button
                              onClick={() => handleDelete(user)}
                              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete user
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-gray-100 md:hidden">
              {users.map((user) => (
                <div key={user._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {user.fullName}
                      </h3>
                      <p className="mt-1 break-all text-sm text-gray-500">
                        {user.email}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">{user.phone}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            user.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === user._id ? null : user._id)
                        }
                        className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openMenuId === user._id && (
                        <div className="absolute right-10 top-0 z-20 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 text-left shadow-xl">
                          <button
                            onClick={() => openEditModal(user)}
                            className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Edit user
                          </button>

                          <button
                            onClick={() => handleDelete(user)}
                            className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete user
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 md:px-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {page} of {pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page >= pages}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? "Edit User" : "Add User"}
              </h3>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
              {formError && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Enter full name"
                  required
                  className="h-11 w-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                  className="h-11 w-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Enter phone number"
                  required
                  className="h-11 w-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as UserRole })
                  }
                  className="h-11 w-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {editingUser ? "New Password" : "Password"}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={
                    editingUser
                      ? "Leave blank to keep current password"
                      : "Create password"
                  }
                  required={!editingUser}
                  className="h-11 w-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editingUser ? "Save Changes" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
