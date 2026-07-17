"use client";

import { useEffect, useState } from "react";
import ConversationSearch from "./ConversationSearch";
import StatusFilter, { type StatusFilterValue } from "./StatusFilter";
import ConversationList from "./ConversationList";
import { listConversations, type ConversationSummary } from "@/lib/conversations";

type ConversationSidebarProps = {
    selectedConversationId?: string | null;
    onSelectConversation?: (id: string) => void;
};

export default function ConversationSidebar({
    selectedConversationId,
    onSelectConversation,
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
