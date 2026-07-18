"use client";

import { useEffect, useState } from "react";
import { ChevronDown, UserPlus } from "lucide-react";
import {
  listAssignableUsers,
  assignConversation,
  type AssignableUser,
} from "@/lib/conversations";

type AssignmentGateProps = {
  sessionId: string;
  onAssigned: () => void;
};

export default function AssignmentGate({ sessionId, onAssigned }: AssignmentGateProps) {
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listAssignableUsers()
      .then((data) => setUsers(data.users))
      .catch(() => setUsers([]));
  }, []);

  async function handleAssign(userId: string) {
    if (!userId) return;
    setAssigning(true);
    setError(null);
    try {
      await assignConversation(sessionId, userId);
      onAssigned();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign conversation");
    } finally {
      setAssigning(false);
    }
  }

  return (
    <div className="shrink-0 border-t border-gray-200 bg-white p-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <UserPlus size={18} />
        </div>

        <p className="mt-2 text-sm font-semibold text-gray-900">
          This conversation isn&apos;t assigned yet
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Assign it to yourself or a team member to start replying.
        </p>

        {error && (
          <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={assigning}
              className="h-10 w-full appearance-none rounded-lg border border-gray-200 pl-3 pr-9 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Select team member...</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <button
            type="button"
            onClick={() => handleAssign(selectedUserId)}
            disabled={assigning || !selectedUserId}
            className="h-10 shrink-0 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {assigning ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
