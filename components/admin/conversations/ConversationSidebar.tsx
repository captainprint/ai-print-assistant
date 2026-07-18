"use client";

import { useEffect, useRef, useState } from "react";
import ConversationSearch from "./ConversationSearch";
import StatusFilter, { type StatusFilterValue } from "./StatusFilter";
import ConversationList from "./ConversationList";
import { listConversations, type ConversationSummary } from "@/lib/conversations";

type ConversationSidebarProps = {
    selectedConversationId?: string | null;
    onSelectConversation?: (id: string) => void;
    refreshSignal?: number;
};

export default function ConversationSidebar({
    selectedConversationId,
    onSelectConversation,
    refreshSignal,
}: ConversationSidebarProps) {
    const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        listConversations(statusFilter)
            .then((data) => {
                if (cancelled) return;
                setConversations(data.conversations);
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : "Failed to load conversations");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [statusFilter]);

    // Silent background refresh (e.g. after an assignment/status change
    // elsewhere) — updates the list without showing a loading state.
    const isFirstRefresh = useRef(true);
    useEffect(() => {
        if (isFirstRefresh.current) {
            isFirstRefresh.current = false;
            return;
        }
        if (refreshSignal === undefined) return;

        let cancelled = false;
        listConversations(statusFilter)
            .then((data) => {
                if (cancelled) return;
                // Merge rather than replace: a conversation the current user just
                // acted on (e.g. reassigned away) may no longer match their
                // visibility rules and drop out of this response. Keep it showing
                // as-is until a full reload — only update fields for items that
                // are still present, and add genuinely new ones.
                setConversations((prev) => {
                    const fresh = new Map(data.conversations.map((c) => [c.sessionId, c]));
                    const existingIds = new Set(prev.map((c) => c.sessionId));
                    const merged = prev.map((c) => fresh.get(c.sessionId) ?? c);
                    const added = data.conversations.filter((c) => !existingIds.has(c.sessionId));
                    return [...added, ...merged];
                });
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshSignal]);

    return (
        <aside className="flex h-full min-h-0 flex-col bg-white">
            <div className="shrink-0 border-b border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-gray-900">
                            Conversations
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage customer chats
                        </p>
                    </div>

                    <StatusFilter value={statusFilter} onChange={setStatusFilter} />
                </div>
            </div>

            <div className="shrink-0 border-b border-gray-200 p-4">
                <ConversationSearch value={searchQuery} onChange={setSearchQuery} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
                <ConversationList
                    conversations={conversations}
                    loading={loading}
                    error={error}
                    searchQuery={searchQuery}
                    selectedConversationId={selectedConversationId}
                    onSelectConversation={onSelectConversation}
                />
            </div>
        </aside>
    );
}
