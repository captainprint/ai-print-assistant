"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const users = [
  {
    id: "USR-001",
    name: "Sakchhi Gurung",
    email: "sakchhi.gurung@captainprint.com",
  },
  {
    id: "USR-002",
    name: "Nisha Bhattarai",
    email: "webmaster@captainprint.com",
  },
  {
    id: "USR-003",
    name: "Vickie Chen",
    email: "vickie@captainprint.com",
  },
  {
    id: "USR-004",
    name: "Lyndsay Nash",
    email: "lyndsay@captainprint.com",
  },
];

export default function AdminUsersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AdminLayout title="Users">
      <div className="border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 md:px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage admin users and access.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 md:px-6">ID</th>
                <th className="px-4 py-3 md:px-6">Name</th>
                <th className="px-4 py-3 md:px-6">Email</th>
                <th className="px-4 py-3 text-right md:px-6">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900 md:px-6">
                    {user.id}
                  </td>
                  <td className="px-4 py-4 text-gray-700 md:px-6">
                    {user.name}
                  </td>
                  <td className="px-4 py-4 text-gray-700 md:px-6">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 text-right md:px-6">
                    <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add User
              </h3>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form className="space-y-4 px-5 py-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="h-11 w-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="h-11 w-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create password"
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
                  className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}