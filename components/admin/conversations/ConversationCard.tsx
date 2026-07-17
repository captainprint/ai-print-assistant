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
};

export default function ConversationCard({
    name,
    initials,
    time,
    status,
    message,
    onClick,
    active = false,
}: ConversationCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative w-full border-b border-gray-100 px-4 py-4 text-left transition ${active ? "bg-blue-50" : "hover:bg-gray-50"
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
    );
}