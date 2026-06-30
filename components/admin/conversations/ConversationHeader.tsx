import { ChevronDown } from "lucide-react";

export default function ConversationHeader() {
    return (
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    SM
                </div>

                <div>
                    <h2 className="text-base font-semibold text-gray-900">
                        Sarah Mitchell
                    </h2>

                    <p className="text-sm text-gray-500">
                        sarah.mitchell@designco.com
                    </p>
                </div>
            </div>

            <div className="relative">
                <select
                    defaultValue="New"
                    className="h-10 appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                    <option>New</option>
                    <option>Open</option>
                    <option>Waiting</option>
                    <option>Resolved</option>
                </select>

                <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
            </div>
        </header>
    );
}