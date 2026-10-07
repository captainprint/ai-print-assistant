"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ApiError, deleteConversation, type ConversationSummary } from "@/lib/conversations";

type DeleteConversationModalProps = {
    conversation: ConversationSummary;
    onCancel: () => void;
    onDeleted: (sessionId: string) => void;
};

export default function DeleteConversationModal({
    conversation,
    onCancel,
    onDeleted,
}: DeleteConversationModalProps) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    async function handleConfirm() {
        setDeleting(true);
        setError("");
        try {
            await deleteConversation(conversation.sessionId);
            onDeleted(conversation.sessionId);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to delete conversation. Try again.");
            setDeleting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900">
                    Delete conversation?
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                    The conversation with{" "}
                    <span className="font-medium text-gray-900">
                        {conversation.customerProfile?.name || "Unknown-User"}
                    </span>{" "}
                    will be moved to the Trash. You can restore it from there at any time.
                </p>

                {error && (
                    <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={deleting}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={deleting}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {deleting && <Loader2 size={14} className="animate-spin" />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
