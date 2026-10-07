"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RotateCcw, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatusBadge from "@/components/admin/conversations/StatusBadge";
import {
    ApiError,
    deleteConversationForever,
    deriveStatus,
    initialsFromName,
    listTrashedConversations,
    relativeTime,
    restoreConversation,
    type TrashedConversation,
} from "@/lib/conversations";

export default function AdminTrashPage() {
    const [conversations, setConversations] = useState<TrashedConversation[]>([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [restoringId, setRestoringId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [conversationToPurge, setConversationToPurge] = useState<TrashedConversation | null>(null);
    const [purging, setPurging] = useState(false);
    const [purgeError, setPurgeError] = useState("");

    // Callers flip `loading` on before calling this; it only settles state.
    const load = useCallback((targetPage: number) => {
        listTrashedConversations(targetPage)
            .then((data) => {
                setError(null);
                setConversations(data.conversations);
                setPages(Math.max(data.pages, 1));
                setTotal(data.total);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Failed to load trash");
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        load(page);
    }, [load, page]);

    function goToPage(targetPage: number) {
        setLoading(true);
        setPage(targetPage);
    }

    function removeFromList(sessionId: string) {
        const remaining = conversations.filter((c) => c.sessionId !== sessionId);
        setTotal((t) => t - 1);
        // Step back a page if this emptied the current one.
        if (remaining.length === 0 && page > 1) goToPage(page - 1);
        else setConversations(remaining);
    }

    async function handleConfirmPurge() {
        if (!conversationToPurge) return;
        setPurging(true);
        setPurgeError("");
        try {
            await deleteConversationForever(conversationToPurge.sessionId);
            removeFromList(conversationToPurge.sessionId);
            setConversationToPurge(null);
        } catch (err) {
            setPurgeError(err instanceof ApiError ? err.message : "Failed to delete conversation. Try again.");
        } finally {
            setPurging(false);
        }
    }

    async function handleRestore(sessionId: string) {
        setRestoringId(sessionId);
        setActionError(null);
        try {
            await restoreConversation(sessionId);
            removeFromList(sessionId);
        } catch (err) {
            setActionError(err instanceof ApiError ? err.message : "Failed to restore conversation. Try again.");
        } finally {
            setRestoringId(null);
        }
    }

    return (
        <AdminLayout title="Trash">
            <div className="rounded-2xl border border-gray-200 bg-white">
                <div className="border-b border-gray-200 p-4 md:p-6">
                    <h1 className="text-lg font-semibold text-gray-900">Trash</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Deleted conversations. Restore one to move it back to Conversations, or
                        delete it forever.
                    </p>
                </div>

                {actionError && (
                    <p className="mx-4 mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 md:mx-6">
                        {actionError}
                    </p>
                )}

                {loading ? (
                    <div className="flex items-center justify-center p-10 text-sm text-gray-500">
                        Loading trash...
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center p-10 text-center text-sm text-red-600">
                        {error}
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 p-10 text-center text-sm text-gray-500">
                        <Trash2 size={28} className="text-gray-300" />
                        Trash is empty.
                    </div>
                ) : (
                    <ul>
                        {conversations.map((conversation) => {
                            const name = conversation.customerProfile?.name || "Unknown-User";
                            const isRestoring = restoringId === conversation.sessionId;

                            return (
                                <li
                                    key={conversation.sessionId}
                                    className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center md:px-6"
                                >
                                    <div className="flex min-w-0 flex-1 gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                                            {initialsFromName(conversation.customerProfile?.name)}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="truncate text-sm font-semibold text-gray-900">
                                                    {name}
                                                </h3>
                                                <StatusBadge status={deriveStatus(conversation)} />
                                            </div>
                                            <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                                                {conversation.preview || "No messages yet"}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                Deleted {relativeTime(conversation.deletedAt)}
                                                {conversation.deletedBy?.fullName
                                                    ? ` by ${conversation.deletedBy.fullName}`
                                                    : ""}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleRestore(conversation.sessionId)}
                                            disabled={restoringId !== null}
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 sm:flex-none"
                                        >
                                            {isRestoring ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                <RotateCcw size={14} />
                                            )}
                                            Restore
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPurgeError("");
                                                setConversationToPurge(conversation);
                                            }}
                                            disabled={restoringId !== null}
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 sm:flex-none"
                                        >
                                            <Trash2 size={14} />
                                            Delete forever
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {!loading && !error && pages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-500 md:px-6">
                        <span>
                            Page {page} of {pages} · {total} total
                        </span>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => goToPage(page - 1)}
                                disabled={page <= 1}
                                className="rounded-lg border border-gray-200 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                onClick={() => goToPage(page + 1)}
                                disabled={page >= pages}
                                className="rounded-lg border border-gray-200 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {conversationToPurge && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Delete forever?
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            The conversation with{" "}
                            <span className="font-medium text-gray-900">
                                {conversationToPurge.customerProfile?.name || "Unknown-User"}
                            </span>{" "}
                            will be permanently deleted. This action cannot be undone.
                        </p>

                        {purgeError && (
                            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                                {purgeError}
                            </p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConversationToPurge(null)}
                                disabled={purging}
                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmPurge}
                                disabled={purging}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {purging && <Loader2 size={14} className="animate-spin" />}
                                Delete forever
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
