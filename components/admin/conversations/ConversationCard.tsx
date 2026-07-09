import StatusBadge from "./StatusBadge";

type ConversationCardProps = {
    id: string;
    name: string;
    initials: string;
    time: string;
    message: string;
    status: string;
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
    const statusStyles: Record<string, string> = {
        New: "bg-blue-100 text-blue-700",
        Open: "bg-green-100 text-green-700",
        Waiting: "bg-amber-100 text-amber-700",
        Resolved: "bg-gray-100 text-gray-600",
    };

    const badgeClass =
        statusStyles[status] ?? "bg-gray-100 text-gray-600";
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
                        <StatusBadge status={status as any} />
                    </div>
                </div>
            </div>
        </button>
    );
}