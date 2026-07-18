"use client";

import { useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
  Calendar,
  Check,
  ChevronDown,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import {
  getConversation,
  listAssignableUsers,
  assignConversation,
  unassignConversation,
  closeConversation,
  deriveStatus,
  initialsFromName,
  ApiError,
  type ConversationDetail,
  type AssignableUser,
} from "@/lib/conversations";

type CustomerInfoProps = {
  sessionId?: string | null;
  refreshSignal?: number;
  onConversationChanged?: () => void;
};

export default function CustomerInfo({ sessionId, refreshSignal, onConversationChanged }: CustomerInfoProps) {
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<AssignableUser | null>(null);
  const [assignmentSearch, setAssignmentSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [accessRevoked, setAccessRevoked] = useState(false);

  function loadConversation(silent = false) {
    if (!sessionId) {
      setConversation(null);
      return;
    }
    if (!silent) setLoading(true);
    getConversation(sessionId)
      .then((data) => {
        setConversation(data);
        setAccessRevoked(false);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 403) {
          // Reassigned/closed elsewhere and no longer visible to this staff
          // member — keep the last-known content, just lock the controls
          // down. It'll drop off the list on the next real reload.
          setAccessRevoked(true);
          return;
        }
        if (!silent) setConversation(null);
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }

  useEffect(() => {
    setAccessRevoked(false);
    loadConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Silent background refresh (e.g. after an assignment/status change
  // triggered from a sibling panel) — no loading flash.
  const isFirstRefresh = useRef(true);
  useEffect(() => {
    if (isFirstRefresh.current) {
      isFirstRefresh.current = false;
      return;
    }
    if (refreshSignal === undefined) return;
    loadConversation(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal]);

  useEffect(() => {
    listAssignableUsers()
      .then((data) => setUsers(data.users))
      .catch(() => setUsers([]));
  }, []);

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(assignmentSearch.toLowerCase())
  );

  async function handleAssign(userId: string) {
    if (!sessionId) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await assignConversation(sessionId, userId);
      loadConversation(true);
      onConversationChanged?.();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to assign conversation");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUnassign() {
    if (!sessionId) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await unassignConversation(sessionId);
      loadConversation(true);
      onConversationChanged?.();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to unassign conversation");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleClose() {
    if (!sessionId) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await closeConversation(sessionId);
      loadConversation(true);
      onConversationChanged?.();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to close conversation");
    } finally {
      setActionLoading(false);
    }
  }

  if (!sessionId) {
    return (
      <aside className="flex h-full min-h-0 flex-col bg-white">
        <div className="shrink-0 border-b border-gray-200 px-5 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900">
            Customer Info
          </h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-5 text-center text-sm text-gray-500">
          Select a conversation to view customer details.
        </div>
      </aside>
    );
  }

  const name = conversation?.customerProfile?.name;
  const status = conversation ? deriveStatus(conversation) : "New";
  const isClosed = !!conversation?.closedAt;
  const isLocked = isClosed || accessRevoked;

  return (
    <aside className="flex h-full min-h-0 flex-col bg-white">
      <div className="shrink-0 border-b border-gray-200 px-5 py-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900">
          Customer Info
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="p-5 text-center text-sm text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="flex flex-col items-center border-b border-gray-200 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                {initialsFromName(name)}
              </div>

              <h3 className="mt-3 text-[15px] font-semibold text-gray-800">
                {name || "Unknown customer"}
              </h3>

              <div className="mt-2">
                <StatusBadge status={status} />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <InfoRow icon={Mail} label="Email" value={conversation?.customerProfile?.email || "Not provided"} />
              <InfoRow icon={Phone} label="Phone" value={conversation?.customerProfile?.phone || "Not provided"} />
              <InfoRow
                icon={Calendar}
                label="First Contact"
                value={
                  conversation?.createdAt
                    ? new Date(conversation.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not provided"
                }
              />
            </div>

            {actionError && (
              <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
                {actionError}
              </div>
            )}

            {/* CONVERSATION STATUS */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Conversation Status
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {isClosed
                  ? "This conversation has been resolved."
                  : accessRevoked
                  ? "This conversation was updated elsewhere. Reload the page to refresh your list."
                  : "Close this conversation once the customer's request is handled."}
              </p>

              {!isClosed && (
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={actionLoading || accessRevoked}
                  className="mt-4 h-10 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Close Conversation
                </button>
              )}
            </div>

            {/* ASSIGNMENT */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Assignment
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Assign this conversation to a team member.
              </p>

              <div className="relative mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAssignmentOpen(!isAssignmentOpen);
                    setAssignmentSearch("");
                  }}
                  disabled={isLocked}
                  className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 text-left transition hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700">
                      {conversation?.assignedTo
                        ? initialsFromName(conversation.assignedTo.fullName)
                        : "--"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800">
                        {conversation?.assignedTo?.fullName || "Unassigned"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {conversation?.assignedTo?.role || "No one assigned"}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    size={17}
                    className={`shrink-0 text-gray-400 transition ${isAssignmentOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {isAssignmentOpen && (
                  <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-100 p-3">
                      <input
                        type="text"
                        value={assignmentSearch}
                        onChange={(e) => setAssignmentSearch(e.target.value)}
                        placeholder="Search team member..."
                        className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {filteredUsers.map((user) => (
                      <button
                        key={user._id}
                        type="button"
                        onClick={() => {
                          if (user._id === conversation?.assignedTo?._id) {
                            setIsAssignmentOpen(false);
                            return;
                          }

                          setPendingUser(user);
                          setIsAssignmentOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-gray-50"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                            {initialsFromName(user.fullName)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-800">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-gray-500">{user.role}</p>
                          </div>
                        </div>

                        {conversation?.assignedTo?._id === user._id && (
                          <Check size={17} className="shrink-0 text-blue-600" />
                        )}
                      </button>
                    ))}
                    {filteredUsers.length === 0 && (
                      <div className="px-4 py-4 text-sm text-gray-500">
                        No team member found.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {conversation?.assignedTo && !isClosed && (
                <button
                  type="button"
                  onClick={handleUnassign}
                  disabled={actionLoading || accessRevoked}
                  className="mt-3 h-10 w-full rounded-lg border border-gray-200 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Unassign
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {pendingUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">
              Transfer chat?
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to transfer this chat to{" "}
              <span className="font-semibold text-gray-900">
                {pendingUser.fullName}
              </span>
              ?
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingUser(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                No
              </button>

              <button
                type="button"
                onClick={() => {
                  handleAssign(pendingUser._id);
                  setPendingUser(null);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Yes, transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

type InfoRowProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
        <Icon size={15} className="text-gray-400" />
        <span>{value}</span>
      </div>
    </div>
  );
}
