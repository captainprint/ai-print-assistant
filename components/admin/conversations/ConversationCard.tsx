"use client";

import { useEffect, useRef, useState } from "react";
import { EllipsisVertical, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { DisplayStatus } from "@/lib/conversations";

type ConversationCardProps = {
    id: string;
    name: string;
    initials: string;
    time: string;
    message: string;
    status: DisplayStatus;
    active?: boolean;
    onClick?: () => void;
    // Only passed for admins — the three-dots menu is hidden otherwise.
    onDelete?: () => void;
};

export default function ConversationCard({
    name,
    initials,
    time,
    status,
    message,
    onClick,
    onDelete,
    active = false,
}: ConversationCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isMenuOpen) return;
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    return (
        <div className="relative border-b border-gray-100">
            <button
                type="button"
                onClick={onClick}
                className={`relative w-full px-4 py-4 text-left transition ${active ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
            >
                {active && <span className="absolute left-0 top-0 h-full w-1 bg-blue-600" />}

                <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                        {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="truncate text-sm font-semibold text-gray-900">
                                {name}
                            </h3>
                            <span className="shrink-0 text-xs text-gray-400">{time}</span>
                        </div>

                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{message}</p>

                        <div className="mt-3">
                            <StatusBadge status={status} />
                        </div>
                    </div>
                </div>
            </button>

            {onDelete && (
                <div ref={menuRef} className="absolute bottom-3 right-3">
                    <button
                        type="button"
                        aria-label="Conversation options"
                        onClick={() => setIsMenuOpen((open) => !open)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                        <EllipsisVertical size={16} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 top-9 z-20 w-40 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onDelete();
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <Trash2 size={15} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
